from pdf2image import convert_from_path

import os
from pathlib import Path

from tqdm import tqdm

root = os.path.join("book parts","Plants by family")

for path in tqdm(Path(root).glob("**/*.pdf")):
    ht = os.path.split(path)
    head = ht[0]
    tail = ht[1]
    #if tail == "Phoenix dactylifera-fwv.pdf":
    convert_from_path(path)[0].save(os.path.join(head, tail[:-4]+".png"), "PNG")
