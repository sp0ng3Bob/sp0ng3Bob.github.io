from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

import os
import json
from tqdm import tqdm



def write_JSON(path, outName, jsonData):
    with open(os.path.join(path, outName+".json"), "w+", encoding="utf-8") as fp:
        json.dump(jsonData, fp)

def write_PDF(path, outName):
    with open(os.path.join(path, outName+".pdf"), "wb+") as fp:
        writer.write(fp)

def visitor_get_title(text, cm, tm, fontDict, fontSize):
    y = tm[5]
    if y > 780:
        title_parts.append(text)

def visitor_get_common_name(text, cm, tm, fontDict, fontSize):
    y = tm[5]
    if y < 780 and y > 700:
        title_parts.append(text)



writer = PdfWriter()
reader = PdfReader(os.path.join("book", "Arriyadh plants.pdf"))


outFolder = "book parts"


## get the author page
writer.add_page(reader.pages[3])
write_PDF(outFolder, "Authors preface")


## get the "Introduction" part
writer = PdfWriter()
for page in tqdm(reader.pages[7:19]):
    writer.add_page(page)
write_PDF(outFolder, "Introduction")


## go over the "Plant portraits A to Z" part
for page in tqdm(reader.pages[20:325]):
    title_parts = []
    writer = PdfWriter()
    
    page.extract_text(visitor_text=visitor_get_title)
    textBody = "".join(title_parts).split(",")
    plantName = textBody[0].strip()
    plantFamily = textBody[1].strip()

    title_parts = []
    page.extract_text(visitor_text=visitor_get_common_name)
    textBody = "".join(title_parts).split(",")
    knownByTheNames = [ n.strip() for n in textBody ]

    mb = page.mediabox
    page.cropbox = RectangleObject((mb.left, 80, mb.right, mb.top))
    
    writer.add_page(page)
    tmpOut = os.path.join(outFolder,"Plants by family",plantFamily)
    if not os.path.exists(tmpOut):
        os.makedirs(tmpOut)
    
    write_PDF(tmpOut, plantName)
    write_JSON(tmpOut,
               plantName,
               {"plantName":plantName,
               "plantFamily":plantFamily,
               "knownByTheNames":knownByTheNames})


## get the "Planning checklists for quick reference" part
writer = PdfWriter()
for page in tqdm(reader.pages[325:458]):
    writer.add_page(page)
write_PDF(outFolder, "Planning checklists for quick reference")

