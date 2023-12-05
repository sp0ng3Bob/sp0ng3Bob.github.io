import fitz
from pathlib import Path

def linearize_pdf(input_path, output_path):
    with fitz.open(input_path) as doc:
        doc.save(output_path, linear=True, deflate=True, clean=True)

#linearize_pdf('./book/Arriyadh plants.pdf', './book/Arriyadh plants-fwv.pdf')

#for pdf in Path("./book parts/").glob("**/*.pdf"):
#    linearize_pdf(pdf,f"{str(pdf)[:-4]}-fwv.pdf")

linearize_pdf('./book parts/Rest of the book.pdf', './book parts/Rest of the book-fwv.pdf')