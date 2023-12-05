from glob import glob
from pypdf import PdfMerger
import os

basePath = "book parts"

def merge(path, output_filename):
    merger = PdfMerger(strict=False)
    for pdffile in glob(path + os.sep + '*-fwv.pdf'):
        if pdffile == output_filename:
            continue
        print(f"Appending: '{pdffile}'")
        bookmark = os.path.basename(pdffile[:-8])
        merger.append(pdffile, bookmark)
    merger.write(output_filename)
    merger.close()


merge(basePath, "merged.pdf")
