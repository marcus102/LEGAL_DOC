import re
from typing import List, Dict
import fitz  # PyMuPDF
from transformers import pipeline

# Document processing utilities
def process_document(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def classify_sections(text: str) -> List[Dict]:
    sections = []
    for section in re.split(r"\n\s*\n", text):
        sections.append({"section": section.strip(), "type": "Unknown"})
    return sections

def extract_entities(text: str) -> List[Dict]:
    ner_pipeline = pipeline("ner", model="dslim/bert-base-NER")
    entities = ner_pipeline(text)
    return entities
