import requests
from bs4 import BeautifulSoup as bs
import json
import re
import time
from datetime import datetime
from typing import Dict, Any, List, Optional


class MushroomScraper:
    def __init__(self):
        self.base_url = "https://www.gobe.si"
        self.gobe = {
            "seznam": [],
            "pogostosti": { "seznam": {} },
            "domačaImena": { "seznam": {} },
            "zavarovane": { "seznam": [] },
            "rdečiSeznam": { "seznam": {} },
            "užitne": { "seznam": [] },
            "pogojnoUžitne": { "seznam": [] },
            "strupene": { "seznam": [] }
        }
        self.session = requests.Session()
        self.cache = {}

    def fetch_page(self, url: str) -> Optional[bs]:
        """
        Fetches a page and returns its bs object. Uses a cache to avoid duplicate requests.
        """
        if url in self.cache:
            return self.cache[url]

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
            )
        }

        try:
            response = self.session.get(url, headers=headers)
            response.raise_for_status()
            soup = bs(response.text, 'html.parser')
            self.cache[url] = soup
            return soup
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None

    def parse_table(self, soup: bs, table_class: str) -> Optional[List[bs]]:
        """
        Finds and returns rows of a specific table class from the soup.
        """
        table = soup.find('table', class_=table_class)
        if not table:
            print(f"Table with class '{table_class}' not found.")
            return None
        return table.find('tbody').find_all('tr') if table.find('tbody') else table.find_all('tr')

    def get_pogostost(self):
        """
        Scrapes mushroom frequency data.
        """
        url = f"{self.base_url}/Gobe/PoPogostostiNaRazstavah"
        soup = self.fetch_page(url)
        if not soup:
            return

        rows = self.parse_table(soup, "sortable simpletable")
        if not rows:
            return

        for row in rows:
            try:
                cols = row.find_all(['td'])
                if len(cols) >= 3:
                    url = cols[1].find('a').get('href', '') if cols[1].find('a') else ''
                    frequency = int(cols[2].get_text(strip=True))
                    if url:
                        self.gobe["pogostosti"]["seznam"][url] = frequency
            except Exception as e:
                print(cols[2])
                print(f"Error parsing pogostost row: {e}")
        self.gobe["pogostosti"]["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split(":", 1)[1].strip()

    def get_domaca_imena(self):
        """
        Scrapes local mushroom names and regions.
        """
        url = f"{self.base_url}/Gobe/DomacaImena"
        soup = self.fetch_page(url)
        if not soup:
            return

        rows = self.parse_table(soup, "")
        if not rows:
            return

        for row in rows[1:]:
            try:
                cols = row.find_all('td')
                if len(cols) == 3:
                    local_names = [name.strip() for name in cols[0].find("p").get_text(strip=True).split(',')]
                    regions = [region.strip() for region in cols[1].find("p").get_text(strip=True).split(',')]
                    urls = [a.get('href', '') for a in cols[2].find("p").find_all('a', class_="wikilink")]

                    for url in urls:
                        if len(url) > 0:
                            if url in self.gobe["domačaImena"]["seznam"]:
                                # Merge names
                                existing_names = self.gobe["domačaImena"]["seznam"][url]["imena"]
                                merged_names = list(set(existing_names + local_names))  # Avoid duplicates
                                
                                # Merge regions
                                existing_regions = self.gobe["domačaImena"]["seznam"][url]["pokrajine"]
                                merged_regions = list(set(existing_regions + regions))  # Avoid duplicates
                                
                                # Update the dictionary
                                self.gobe["domačaImena"]["seznam"][url]["imena"] = merged_names
                                self.gobe["domačaImena"]["seznam"][url]["pokrajine"] = merged_regions
                            else:
                                # Add new entry if URL doesn't exist
                                self.gobe["domačaImena"]["seznam"][url] = {"imena": local_names, "pokrajine": regions}

            except Exception as e:
                print(f"Error parsing domača imena row: {e}")
        self.gobe["domačaImena"]["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split(":", 1)[1].strip()

    def get_rdeci_seznam(self):
        """
        Scrapes endangered mushroom list.
        """
        url = f"{self.base_url}/Gobe/RdeciSeznam"
        soup = self.fetch_page(url)
        if not soup:
            return

        ol = soup.find("ol")
        if not ol:
            return

        for li in ol.find_all('li'):
            try:
                a = li.find('a')
                if a:
                    url = a["href"]
                    category = li.get_text(strip=True).split('kategorija ogroženosti:')[1].strip()
                    self.gobe["rdečiSeznam"]["seznam"][url] = category
            except Exception as e:
                print(f"Error parsing rdeči seznam row: {e} - {a.get_text(strip=True)}")
        
        self.gobe["rdečiSeznam"]["iucn"] = {
            "naslov": "Kategorije ogroženosti IUCN (1978)",
            "kategorije": {
                "E": "(Endangered) - prizadeta vrsta. V to skupino sodijo najbolj ogrožene vrste. Njihova številčnost upada in ob nadaljevanju vzrokov ogroženosti lahko izumrejo.",
                "V": "(Vulnerable) - ranljiva vrsta. Ranljive vrste so sestavni del biotopov, katerih ekološko ravnotežje je občutljivo že na manjše človekove vplive (npr. mrazišča, močvirja, topli izviri, barja). Z neprimernim poseganjem v biotop lahko posredno uničimo glive.",
                "R": "(Rare) - redka vrsta. Glive, ki niso neposredno ogrožene, njihovo pojavljanje pa je zanesljivo v največ petih kvadrantih srednjeevropskega kartiranja velikost kvadranta je 5,8 x 5,6 km; (v Sloveniji je 613 kvadrantov), obravnavamo kot redke. Kadar ugotovimo, da so ogrožene, jih uvrstimo v eno od prejšnjih kategorij, sicer pa njihovo številčnost le spremljamo, da smo ob dejanski ogroženosti pripravljeni za varstveno ukrepanje.",
                "K": "(Insufficiently Known) - nezadostno znana vrsta. Pomožna kategorija, ki vključuje vrste, za katere obstaja možnost, da pripada eni izmed kategorij ogroženosti, vendar je na razpolago premalo podatkov za zanesljivo varstveno opredelitev. V to skupino so uvrščene vrste, za katere je na razpolago premalo podatkov za opredelitev ogroženosti.",
                "I": "(Indeterminate) - neopredeljena"
            }
        }
        
        self.gobe["rdečiSeznam"]["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split(":", 1)[1].strip()

    def get_strupene_gobe(self):
        url = f"{self.base_url}/Gobe/StrupeneGobe"
        soup = self.fetch_page(url)
        if not soup:
            return
        
        try:
            # smrtno strupene
            h1 = soup.find("h1", string="Smrtno strupene gobe, najdene v Sloveniji") #string=lambda text: text and "Smrtno strupene gobe, najdene v Sloveniji" in text)
            if h1:
                smrtne_ol = h1.find_next("ol")
                smrtno_strupene = [ li.find("a")["href"] for li in smrtne_ol.find_all("li") if li.find("a") ]
                self.gobe["strupene"]["seznam"].append({
                    "naslov": h1.text.strip(),
                    "seznam": smrtno_strupene
                })

            h1 = soup.find("h1", string="Strupene gobe v Sloveniji") #string=lambda text: text and "Strupene gobe v Sloveniji" in text)
            if h1:
                parent_div = h1.find_parent("div")
                elements = []
                for elem in h1.find_all_next(["h2", "p", "div"]):
                    if elem in parent_div.find_all(["h2", "p", "div"]):
                        if elem.get("class") == ["vspace"] or elem.name in ["h2", "p"]:
                            elements.append(elem)
                
                for (h2, p, div) in zip(elements[0::3], elements[1::3], elements[2::3]):
                    print(f"{h2.text.strip()}, {[ a['href'] for a in p.find_all('a') ]}")
                    smrtno_strupene = [ li.find("a")["href"] for li in smrtne_ol.find_all("li") if li.find("a") ]
                    self.gobe["strupene"]["seznam"].append({
                        "naslov": h2.text.strip(),
                        "seznam": [ a["href"] for a in p.find_all("a") ]
                    })
            
            self.gobe["strupene"]["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split(":", 1)[1].strip()
        except Exception as e:
            print(f"Error processing strupene gobe: {e}")

    def get_list_from(self, element: str, url: str, key: str):
        """
        Scrapes lists from unordered lists (ul).
        """
        soup = self.fetch_page(url)
        if not soup:
            return

        ul = soup.find('div', id='wikitext').find(element)
        if not ul:
            return

        self.gobe[key]["seznam"] = [li.find('a')['href'] for li in ul.find_all('li') if li.find('a')]
        self.gobe[key]["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split(":", 1)[1].strip()

    def scrape_mushroom_images(self, mushroomUrl: str):
        try:
            gallery = {}
            gallery["slike"] = []
            
            base_url = "https://www.gobe.si/Slike/"
            url = f"{base_url}{mushroomUrl}"
            soup = self.fetch_page(url)
            if not soup:
                return gallery
            
            content = soup.find('div', id='wikitext')
            if not content:
                return gallery
            
            img = {}
            
            # get first image
            try:
                p_first_image = content.find_all('p')[0]
                if p_first_image and p_first_image.find('img'):
                    img_name = p_first_image.find('img').get('src', '').split("/")[-1]
                    small_tag = p_first_image.find('small')
                    img_author = small_tag.get_text(strip=True) if small_tag else ""
                    
                    img['url'] = f"{base_url.lower()}{img_name}"
                    img['avtor'] = img_author.split(":", 1)[1].strip() if img_author else "/"
                    
                    gallery["slike"].append(img)
            except Exception as e:
                print(f"Error processing first image: {e}, {mushroomUrl}")
                
            # get images in the table
            try:
                table = content.find('table')
                if table and table.find('td'):
                    for td in table.find_all('td'):
                        img_name = td.find('img').get('src', '').split("/")[-1].replace("thumb_", "")
                        small_tag = p_first_image.find('small')
                        img_author = small_tag.get_text(strip=True) if small_tag else ""
                        
                        img = {}
                        img['url'] = f"{base_url.lower()}{img_name}"
                        img['avtor'] = img_author.split(":", 1)[1].strip() if img_author else "/"
                        
                        gallery["slike"].append(img)
            except Exception as e:
                print(f"Error processing other images: {e}, {mushroomUrl}")
                
            gallery["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split(":", 1)[1].strip()
            return gallery
        
        except Exception as e:
            print(f"Error scraping mushroom gallery page {url}: {e}")
            return gallery

    def scrape_mushroom_page(self, url: str):
        try:
            soup = self.fetch_page(url)
            if not soup:
                return
            
            content = soup.find('div', id='wikitext')
            if not content:
                return None
            
            data = {}
            front_image = ""
            
            try:
                img_div = content.find('div', class_='img imgcaption')
                if img_div and img_div.find('img'):
                    img_url = img_div.find('img').get('src', '')
                    if img_url:
                        # Remove thumbnail prefix
                        img_url = img_url.replace('thumb_', '')
                        front_image = img_url
            except Exception as e:
                print(f"Error processing image: {e}")
            
            # Rod (Genus) processing
            try:
                h1 = content.find('h1')
                if h1:
                    rod_content = h1.find_next_sibling('p')
                    if rod_content:
                        rod_lat = rod_content.find('strong')
                        rod_link = rod_content.find('a')
                        
                        if rod_lat and rod_link:
                            rod_lat_text = rod_lat.get_text(strip=True)
                            rod_slo_text = rod_link.get_text(strip=True)
                            rod_url = rod_link.get('href', '')
                            
                            data['rod'] = {}
                            data['rodUrl'] = rod_url
                            data['rod']['lat'] = rod_lat_text
                            data['rod']['slo'] = rod_slo_text
            except Exception as e:
                print(f"Error processing rod: {e}")

            # Roman to Slovenian month mapping
            roman_months = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
            slovenian_months = [
                "Januar", "Februar", "Marec", "April", "Maj", "Junij", 
                "Julij", "Avgust", "September", "Oktober", "November", "December"
            ]

            # Other details processing
            for p in content.find_all('p', class_='vspace'):
                try:
                    strong = p.find('strong')
                    if strong:
                        # Get title and description
                        title = strong.get_text(strip=True).lower()

                        # Special processing for specific titles
                        if title == 'rastišče':
                            desc = p.get_text(strip=True)[len(strong.get_text()):].lstrip()
                            desc = desc[1:].strip() if desc[0:1] == ":" else desc.strip()
                            if desc:
                                desc = desc[0:1].upper() + desc[1:]
                        
                            # Check for time of growth
                            time_split = desc.split("Čas rasti")
                            if len(time_split) > 1:
                                # Process months
                                months_list = []
                                time_split = time_split[1].split(":")
                                month_parts = time_split[1].strip().split("-")
                                for part in month_parts:
                                    part = part.strip()
                                    if part and part in roman_months:
                                        month_index = roman_months.index(part)
                                        months_list.append(slovenian_months[month_index])
                                
                                data['časRasti'] = months_list
                                # Use the part before time of growth as rastišče
                                desc = time_split[0].strip()
                            
                            data['rastišče'] = desc

                        elif title == 'sinonimi':
                            desc = p.get_text(strip=True)[len(strong.get_text()):].lstrip()
                            desc = desc[1:].strip() if desc[0:1] == ":" else desc.strip()
                            if desc:
                                desc = desc[0:1].upper() + desc[1:]
                                
                            # Process synonyms
                            synonyms = [syn.strip() for syn in desc.split(',')]
                            synonyms[0].replace(":", "")
                            data['sinonimi'] = synonyms

                        elif title == 'podobne vrste':
                            desc = p.decode_contents().strip()[len(strong.decode_contents().strip()):].lstrip()
                            desc = desc[1:].strip() if desc[0:1] == ":" else desc.strip()
                            if desc:
                                desc = desc[0:1].upper() + desc[1:]
                                
                            data['podobneVrste'] = desc
                        
                        elif title == 'uporabnost':
                            desc = p.decode_contents().strip()[len(strong.decode_contents().strip()):].lstrip()
                            desc = desc[1:].strip() if desc[0:1] == ":" else desc.strip()
                            if desc:
                                desc = desc[0:1].upper() + desc[1:]
                                
                            data[title] = desc
                            
                        # Generic mapping for other titles
                        elif title in ['značilnost', 'klobuk', 'bet', 'trosovnica', 'meso', 'trosi']:
                            desc = p.get_text(strip=True)[len(strong.get_text()):].lstrip()
                            desc = desc[1:].strip() if desc[0:1] == ":" else desc.strip()
                            if desc:
                                desc = desc[0:1].upper() + desc[1:]
                            data[title] = desc

                except Exception as e:
                    print(f"Error processing details for {title}: {e}")

            data["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split(":", 1)[1].strip()
            
            time.sleep(2)
            data["galerija"] = self.scrape_mushroom_images(url.split("/")[-1])
            if (len(data["galerija"]["slike"]) == 0) and front_image != "":
                data["galerija"]["slike"].append({ "url": front_image, "avtor": "/" })
            
            return data

        except Exception as e:
            print(f"Error scraping mushroom page {url}: {e}")
            return None

    def get_mushroom_list(self):
        """
        Scrapes the main mushroom list and enriches it with additional metadata.
        """
        url = f"{self.base_url}/Gobe/Gobe"
        soup = self.fetch_page(url)
        if not soup:
            return

        ol = soup.find('ol')
        if not ol:
            print("No mushroom list found!")
            return

        for idx, li in enumerate(ol.find_all('li')):
            try:
                mushroom = {
                    "id": idx
                }

                a = li.find('a', class_='wikilink')
                if not a:
                    continue

                mushroom["url"] = a.get('href', '')
                names = a.get_text(strip=True).split(',')
                mushroom["latIme"] = names[0].strip() if len(names) > 0 else "/"
                mushroom["sloIme"] = names[1].strip() if len(names) > 1 else "/"
                mushroom["pogostost"] = self.gobe["pogostosti"]["seznam"].get(mushroom["url"], "/")
                mushroom["domačeIme"] = self.gobe["domačaImena"]["seznam"].get(mushroom["url"], {}).get("imena", "/")
                mushroom["zavarovana"] = "DA" if mushroom["url"] in self.gobe["zavarovane"]["seznam"] else "NE"
                mushroom["naRdečemSeznamu"] = "DA" if mushroom["url"] in self.gobe["rdečiSeznam"]["seznam"].keys() else "NE"
                mushroom["užitna"] = (
                    "užitna" if mushroom["url"] in self.gobe["užitne"]["seznam"]
                    else "pogojno užitna" if mushroom["url"] in self.gobe["pogojnoUžitne"]["seznam"]
                    else "neužitna ali neznano"
                )

                mushroom["data"] = self.scrape_mushroom_page(mushroom["url"])
                time.sleep(3)

                self.gobe["seznam"].append(mushroom)
            except Exception as e:
                print(f"Error processing mushroom {idx}: {e}")

    def scrape_all(self):
        """
        Orchestrates the entire scraping process and outputs data to JSON.
        """
        print("Scraping mushroom data...")
        # self.get_pogostost()
        # time.sleep(2)
        # self.get_domaca_imena()
        # time.sleep(2)
        # self.get_list_from("ol", f"{self.base_url}/Gobe/ZasciteneGobe", "zavarovane")
        # time.sleep(2)
        # self.get_rdeci_seznam()
        # time.sleep(2)
        # self.get_list_from("ul", f"{self.base_url}/Gobe/UzitneGobe", "užitne")
        # time.sleep(2)
        # self.get_list_from("ul", f"{self.base_url}/Gobe/PogojnoUzitneGobe", "pogojnoUžitne")        
        # time.sleep(2)
        self.get_strupene_gobe()
        # time.sleep(2)
        # self.get_mushroom_list()

        # timestamp = datetime.now().strftime("%d.%m.%Y %H:%M")
        # self.gobe["podatkiShranjeni"] = timestamp
        
        # # Save to JSON
        # output_file = "gobe.si.json" #f"mushrooms_{timestamp}.json"
        # with open(output_file, "w", encoding="utf-8") as f:
            # json.dump(self.gobe, f, ensure_ascii=False, indent=2)
        # print(f"Scraping complete. Data saved to {output_file}")
        

if __name__ == "__main__":
    scraper = MushroomScraper()
    scraper.scrape_all()