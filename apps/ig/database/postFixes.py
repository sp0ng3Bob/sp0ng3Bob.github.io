import json
import re

with open("gobe.si.json", "r", encoding="utf-8") as file:
    data = json.load(file)

def checkGallery(obj):
    for goba in obj["seznam"]:
        if not goba["data"] or not goba["data"]["galerija"] or len(goba["data"]["galerija"]["slike"]) == 0:
            print(str(goba["id"]) + " - " + goba["url"].replace("Gobe", "Slike"))
            
def findOccurrences(text, search_list):
    matches = []
    
    # Create regex pattern to match any of the words in search_list
    pattern = re.compile("|".join(map(re.escape, search_list)))

    for match in pattern.finditer(text):  # Find all occurrences
        found_word = match.group()  # Matched word
        list_index = search_list.index(found_word)  # Index in search list
        text_index = match.start()  # Index in the text
        matches.append((list_index, text_index, found_word))

    return matches

def replaceOccurrences(text, search_list, replacement="***"):
    pattern = re.compile("|".join(map(re.escape, search_list)))
    return pattern.sub(replacement, text)

def fixPodobneVrste(obj):
    seznam_gob = []
    for goba in obj["seznam"]:
        seznam_gob.append(f"{goba['latIme']}, {goba['sloIme']}")

    for goba in obj["seznam"][0:5]:
        if "podobneVrste" in goba["data"] and len(goba["data"]["podobneVrste"]) > 0:
            occ = findOccurrences(goba["data"]["podobneVrste"], seznam_gob)
            tmp = goba["data"]["podobneVrste"]
            
            for find in occ[::-1]:
                goba_id, index, goba_text = find
                length = len(goba_text)
                front = "" if tmp[index-1] == " " else " "
                back = "" if tmp[index+length] == " " else " "
                print(tmp[index-1], tmp[index+length])
                tmp = f"{tmp[0:index]}{front}<a href=\"?goba={goba_id}\">{goba_text}</a>{back}{tmp[index+length:]}"
            print(goba["id"], tmp)
            


checkGallery(data)
print()
fixPodobneVrste(data)
