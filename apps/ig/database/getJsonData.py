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
            "pogojnoUžitne": { "seznam": [] }
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
        self.gobe["pogostosti"]["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split("strani:")[1].strip()

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
        self.gobe["domačaImena"]["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split("strani:")[1].strip()

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
        self.gobe["rdečiSeznam"]["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split("strani:")[1].strip()

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
        self.gobe[key]["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split("strani:")[1].strip()

    def scrape_mushroom_page(self, url: str):
        try:
            soup = self.fetch_page(url)
            if not soup:
                return
            
            content = soup.find('div', id='wikitext')
            if not content:
                return None
            
            data = {}
            
            try:
                img_div = content.find('div', class_='img imgcaption')
                if img_div and img_div.find('img'):
                    img_url = img_div.find('img').get('src', '')
                    if img_url:
                        # Remove thumbnail prefix
                        img_url = img_url.replace('thumb_', '')
                        data['slikaUrl'] = img_url
                        data['slikaIme'] = img_url.split("/")[-1]
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
                        # Remove the strong text and first character after it, then strip
                        desc = p.get_text(strip=True)[len(strong.get_text()):].lstrip()

                        # Special processing for specific titles
                        if title == 'rastišče':
                            # Check for time of growth
                            time_split = desc.split("Čas rasti:")
                            if len(time_split) > 1:
                                # Process months
                                months_list = []
                                month_parts = time_split[1].strip().split("-")
                                for part in month_parts:
                                    part = part.strip()
                                    if part and part in roman_months:
                                        month_index = roman_months.index(part)
                                        months_list.append(slovenian_months[month_index])
                                
                                data['časRasti'] = months_list
                                # Use the part before time of growth as rastišče
                                desc = time_split[0].strip()
                            
                            data['rastišče'] = desc.replace(": ", "")

                        elif title == 'sinonimi':
                            # Process synonyms
                            synonyms = [syn.strip() for syn in desc.split(',')]
                            synonyms[0].replace(":", "")
                            data['sinonimi'] = synonyms

                        elif title == 'podobne vrste':
                            data['podobneVrste'] = desc.replace(": ", "")
                            
                        # Generic mapping for other titles
                        elif title in ['značilnosti', 'klobuk', 'bet', 'trosovnica', 'meso', 'trosi', 'uporabnost']:
                            data[title] = desc.replace(": ", "")

                except Exception as e:
                    print(f"Error processing details for {title}: {e}")

            data["zadnjaSprememba"] = soup.find('div', class_="lastmod").get_text().split("strani:")[1].strip()
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

        for idx, li in enumerate(ol.find_all('li'), 1):
            try:
                mushroom = {
                    "id": idx
                }

                a = li.find('a', class_='wikilink')
                if not a:
                    continue

                mushroom["url"] = a.get('href', '')
                #names = a.get_text(strip=True).split(',')
                #mushroom["latIme"] = names[0].strip() if len(names) > 0 else "/"
                #mushroom["sloIme"] = names[1].strip() if len(names) > 1 else "/"
                #mushroom["pogostost"] = self.gobe["pogostosti"]["seznam"].get(mushroom["url"], "/")
                #mushroom["domačeIme"] = self.gobe["domačaImena"]["seznam"].get(mushroom["url"], {}).get("imena", "/")
                #mushroom["zavarovana"] = "DA" if mushroom["url"] in self.gobe["zavarovane"]["seznam"] else "NE"
                #mushroom["naRdečemSeznamu"] = "DA" if mushroom["url"] in self.gobe["rdečiSeznam"]["seznam"].keys() else "NE"

                mushroom["data"] = self.scrape_mushroom_page(mushroom["url"])
                #time.sleep(5)

                self.gobe["seznam"].append(mushroom)
                return
            except Exception as e:
                print(f"Error processing mushroom {idx}: {e}")

    def scrape_all(self):
        """
        Orchestrates the entire scraping process and outputs data to JSON.
        """
        print("Scraping mushroom data...")
        #self.get_pogostost()
        #self.get_domaca_imena()
        #self.get_list_from("ol", f"{self.base_url}/Gobe/ZasciteneGobe", "zavarovane")
        #self.get_rdeci_seznam()
        #self.get_list_from("ul", f"{self.base_url}/Gobe/UzitneGobe", "užitne")
        #self.get_list_from("ul", f"{self.base_url}/Gobe/PogojnoUzitneGobe", "pogojnoUžitne")
        self.get_mushroom_list()

        # Save to JSON
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        #output_file = f"mushrooms_{timestamp}.json"
        output_file = "gobe.si.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(self.gobe, f, ensure_ascii=False, indent=2)
        print(f"Scraping complete. Data saved to {output_file}")


if __name__ == "__main__":
    scraper = MushroomScraper()
    scraper.scrape_all()