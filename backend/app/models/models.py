from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class DocumentBase(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    document_type: str
    content: str
    processed_content: Optional[dict] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

class Section(BaseModel):
    title: str
    content: str
    classification: Optional[str] = None
    confidence_score: Optional[float] = None

class Entity(BaseModel):
    text: str
    label: str
    start_idx: int
    end_idx: int

class ProcessedDocument(DocumentBase):
    sections: List[Section] = []
    entities: List[Entity] = []
    similar_docs: List[str] = []