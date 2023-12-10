import json
from pathlib import Path
import os

from tqdm import tqdm


root = os.path.join("book parts","Plants by family")

database = {}


## go over all of the json files (for each plant)
for jsonf in tqdm(Path(root).glob("**/*.json")):
    ht = os.path.split(jsonf)
    head = ht[0]
    name = ht[1][:-5]
    with open(jsonf, "r", encoding="utf-8") as jsnp:
        plantData = json.loads(jsnp.read())
    database[name] = plantData

## dump database to json file
with open(os.path.join(root, "PlantsData.json"), "w+", encoding="utf-8") as dbp:
    json.dump(database, dbp)
