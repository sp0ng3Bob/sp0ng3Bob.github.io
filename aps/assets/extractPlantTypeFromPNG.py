import cv2
import numpy as np
import matplotlib.pyplot as plt

import os
from pathlib import Path

from tqdm import tqdm
import time
import json
import math



def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(r, g, b)



legend = os.path.join("book legend")

root = os.path.join("book parts","Plants by family")


## construct legend colors
colors = {}
hsvColors = []
for path in Path(legend).glob("**/*.png"):
    image = cv2.imread(str(path))
    [b,g,r] = image[6,6]
    hsvImage = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    [h,s,l] = hsvImage[0,0]
    print(b,g,r," | ",h,s,l)
    hsvColors.append([h,s,l])
    colors[rgb_to_hex(r,g,b)] = os.path.split(path)[1][:-4]


print(colors)
##keys_list = list(colors.keys())
##
##
#### go over the PNG of each plant
##for path in tqdm(Path(root).glob("**/*.png")):
##    ht = os.path.split(path)
##    folders = ht[0]
##    name = ht[1][:-4]
##    
##    with open(os.path.join(folders, name+".json"), "r", encoding="utf-8") as ifp:
##        jsonData = json.load(ifp)
##
##    #tmpImg = cv2.imread(str(path).encode())
##    tmpImg = plt.imread(str(path)) #have to do it because of special chars in the path
##    cv2Image = cv2.cvtColor((tmpImg * 255).astype('uint8'), cv2.COLOR_RGB2BGR)
##    hsvTmpImg = cv2.cvtColor(cv2Image, cv2.COLOR_BGR2HSV)
##    tmpHSV = hsvTmpImg[105,1000]
##
##    ## calculate the euclidean distance for the 3D vectors of HSV values/colors
##    actualHSVColor = min(hsvColors,
##                         key=lambda item: math.sqrt(((float(item[0]) - tmpHSV[0])**2) + ((float(item[1]) - tmpHSV[1])**2) + ((float(item[2]) - tmpHSV[2])**2)))
##
##    try:
##        jsonData["plantType"] = colors[keys_list[hsvColors.index(actualHSVColor)]]
##    except:
##        print("error with", name, "color was", tmpColor, "with rgb values", r,g,b)
##
##    with open(os.path.join(folders, name+".json"), "w", encoding="utf-8") as ofp:
##        json.dump(jsonData, ofp)
