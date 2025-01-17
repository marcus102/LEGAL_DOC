from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import fitz  # PyMuPDF
import os
import shutil
from transformers import pipeline
from sentence_transformers import SentenceTransformer
import torch
from typing import List, Optional
import numpy as np

# from app.models.models import DocumentBase, ProcessedDocument
import spacy

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DATABASE_URL = "mongodb://127.0.0.1:27017/LEGAL"
client = AsyncIOMotorClient(DATABASE_URL)
db = client.LEGAL

# Load AI models
try:
    nlp = spacy.load("en_core_web_lg")
except OSError:
    print("Downloading spacy model...")
    os.system("python -m spacy download en_core_web_lg")
    nlp = spacy.load("en_core_web_lg")

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
sentence_model = SentenceTransformer("all-MiniLM-L6-v2")

# Entity types we want to extract
ENTITY_TYPES = ["PERSON", "ORG", "DATE", "MONEY", "GPE"]


@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(DATABASE_URL)
    app.mongodb = app.mongodb_client.LEGAL


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()


async def extract_text_from_pdf(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


async def process_document(text: str, doc_id: str):
    # Process text with spaCy
    doc = nlp(text)

    # Extract entities
    entities = []
    for ent in doc.ents:
        if ent.label_ in ENTITY_TYPES:
            entities.append(
                {
                    "text": ent.text,
                    "label": ent.label_,
                    "start_idx": ent.start_char,
                    "end_idx": ent.end_char,
                }
            )

    # Split into sections (simplified version)
    sections = []
    current_section = ""
    current_title = "Main"

    for line in text.split("\n"):
        if line.isupper() and len(line.split()) <= 5:  # Potential section header
            if current_section:
                sections.append(
                    {"title": current_title, "content": current_section.strip()}
                )
            current_title = line
            current_section = ""
        else:
            current_section += line + "\n"

    # Add the last section
    if current_section:
        sections.append({"title": current_title, "content": current_section.strip()})

    # Classify sections
    clause_types = [
        "Confidentiality",
        "Termination",
        "Liability",
        "Payment Terms",
        "Governing Law",
    ]

    for section in sections:
        results = classifier(
            section["content"][:512], candidate_labels=clause_types
        )  # Limit text length for classification
        section["classification"] = results["labels"][0]
        section["confidence_score"] = results["scores"][0]

    # Update document in database
    await db.documents.update_one(
        {"_id": ObjectId(doc_id)},
        {"$set": {"processed_content": {"sections": sections, "entities": entities}}},
    )

    return {"sections": sections, "entities": entities}


@app.get("/")
async def root():
    return {"message": "Legal Document Processing API"}


@app.post("/upload/")
async def upload_document(file: UploadFile = File(...)):
    # Create temp directory if it doesn't exist
    os.makedirs("temp", exist_ok=True)

    # Save file temporarily
    temp_file_path = f"temp/{file.filename}"

    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text
        text = await extract_text_from_pdf(temp_file_path)

        # Create document in database
        document = {
            "title": file.filename,
            "document_type": "contract",
            "content": text,
        }

        result = await db.documents.insert_one(document)

        # Process document
        processed_content = await process_document(text, str(result.inserted_id))

        return {"id": str(result.inserted_id), "processed_content": processed_content}

    finally:
        # Clean up temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.get("/documents/{doc_id}")
async def get_document(doc_id: str):
    document = await db.documents.find_one({"_id": ObjectId(doc_id)})
    if document:
        document["_id"] = str(document["_id"])
        return document
    raise HTTPException(status_code=404, detail="Document not found")


@app.get("/documents/")
async def list_documents():
    documents = []
    cursor = db.documents.find()
    async for document in cursor:
        document["_id"] = str(document["_id"])
        documents.append(document)
    return documents


@app.get("/search/")
async def search_documents(query: str, doc_type: Optional[str] = None):
    filter_query = {}
    if doc_type:
        filter_query["document_type"] = doc_type

    # Basic text search
    filter_query["content"] = {"$regex": query, "$options": "i"}

    cursor = db.documents.find(filter_query)

    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)

    return results


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
