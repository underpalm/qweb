from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

# Contact Message Models
class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    status: str = "unread"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Job Models
class JobCreate(BaseModel):
    title: str
    location: str
    location_type: str  # REMOTE, HYBRID, ON-SITE
    description: str
    requirements: List[str]
    benefits: List[str]
    accent_color: str = "yellow"  # yellow, blue, orange

class Job(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    location: str
    location_type: str
    description: str
    requirements: List[str]
    benefits: List[str]
    accent_color: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Application Models
class ApplicationCreate(BaseModel):
    job_id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    cover_letter: str
    experience_years: int

class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    job_title: str = ""
    name: str
    email: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    cover_letter: str
    experience_years: int
    status: str = "new"  # new, reviewing, interviewed, accepted, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== HELPER FUNCTIONS ====================

def serialize_datetime(doc: dict) -> dict:
    """Convert datetime to ISO string for MongoDB storage"""
    if 'created_at' in doc and isinstance(doc['created_at'], datetime):
        doc['created_at'] = doc['created_at'].isoformat()
    return doc

def deserialize_datetime(doc: dict) -> dict:
    """Convert ISO string back to datetime"""
    if 'created_at' in doc and isinstance(doc['created_at'], str):
        doc['created_at'] = datetime.fromisoformat(doc['created_at'])
    return doc

# ==================== ROOT ENDPOINT ====================

@api_router.get("/")
async def root():
    return {"message": "Qradient API is running"}

# ==================== CONTACT ENDPOINTS ====================

@api_router.post("/contacts", response_model=ContactMessage)
async def create_contact(input: ContactMessageCreate):
    contact = ContactMessage(**input.model_dump())
    doc = serialize_datetime(contact.model_dump())
    await db.contacts.insert_one(doc)
    return contact

@api_router.get("/contacts", response_model=List[ContactMessage])
async def get_contacts():
    contacts = await db.contacts.find({}, {"_id": 0}).to_list(1000)
    return [deserialize_datetime(c) for c in contacts]

@api_router.patch("/contacts/{contact_id}/status")
async def update_contact_status(contact_id: str, status: str):
    result = await db.contacts.update_one(
        {"id": contact_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Status updated"}

@api_router.delete("/contacts/{contact_id}")
async def delete_contact(contact_id: str):
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted"}

# ==================== JOBS ENDPOINTS ====================

@api_router.post("/jobs", response_model=Job)
async def create_job(input: JobCreate):
    job = Job(**input.model_dump())
    doc = serialize_datetime(job.model_dump())
    await db.jobs.insert_one(doc)
    return job

@api_router.get("/jobs", response_model=List[Job])
async def get_jobs(active_only: bool = False):
    query = {"is_active": True} if active_only else {}
    jobs = await db.jobs.find(query, {"_id": 0}).to_list(1000)
    return [deserialize_datetime(j) for j in jobs]

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return deserialize_datetime(job)

@api_router.patch("/jobs/{job_id}")
async def update_job(job_id: str, input: JobCreate):
    result = await db.jobs.update_one(
        {"id": job_id},
        {"$set": input.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job updated"}

@api_router.patch("/jobs/{job_id}/toggle")
async def toggle_job_status(job_id: str):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    new_status = not job.get("is_active", True)
    await db.jobs.update_one({"id": job_id}, {"$set": {"is_active": new_status}})
    return {"message": f"Job {'activated' if new_status else 'deactivated'}"}

@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    result = await db.jobs.delete_one({"id": job_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted"}

# ==================== APPLICATIONS ENDPOINTS ====================

@api_router.post("/applications", response_model=Application)
async def create_application(input: ApplicationCreate):
    # Get job title
    job = await db.jobs.find_one({"id": input.job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    application = Application(**input.model_dump(), job_title=job["title"])
    doc = serialize_datetime(application.model_dump())
    await db.applications.insert_one(doc)
    return application

@api_router.get("/applications", response_model=List[Application])
async def get_applications(job_id: Optional[str] = None):
    query = {"job_id": job_id} if job_id else {}
    applications = await db.applications.find(query, {"_id": 0}).to_list(1000)
    return [deserialize_datetime(a) for a in applications]

@api_router.get("/applications/{application_id}", response_model=Application)
async def get_application(application_id: str):
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return deserialize_datetime(application)

@api_router.patch("/applications/{application_id}/status")
async def update_application_status(application_id: str, status: str):
    valid_statuses = ["new", "reviewing", "interviewed", "accepted", "rejected"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    result = await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Status updated"}

@api_router.delete("/applications/{application_id}")
async def delete_application(application_id: str):
    result = await db.applications.delete_one({"id": application_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Application deleted"}

# ==================== STATS ENDPOINT ====================

@api_router.get("/stats")
async def get_stats():
    total_contacts = await db.contacts.count_documents({})
    unread_contacts = await db.contacts.count_documents({"status": "unread"})
    total_jobs = await db.jobs.count_documents({})
    active_jobs = await db.jobs.count_documents({"is_active": True})
    total_applications = await db.applications.count_documents({})
    new_applications = await db.applications.count_documents({"status": "new"})
    
    return {
        "contacts": {"total": total_contacts, "unread": unread_contacts},
        "jobs": {"total": total_jobs, "active": active_jobs},
        "applications": {"total": total_applications, "new": new_applications}
    }

# ==================== SEED DATA ENDPOINT ====================

@api_router.post("/seed")
async def seed_data():
    """Seed initial job data if no jobs exist"""
    existing_jobs = await db.jobs.count_documents({})
    if existing_jobs > 0:
        return {"message": "Data already exists"}
    
    initial_jobs = [
        {
            "title": "AI Creative Architect",
            "location": "Remote / London",
            "location_type": "REMOTE",
            "description": "Bridge neural networks with high-end design systems. You'll work at the intersection of AI and creativity, building tools that help designers leverage machine learning.",
            "requirements": [
                "5+ years experience in AI/ML development",
                "Strong portfolio in creative tech projects",
                "Experience with generative AI models",
                "Excellent communication skills"
            ],
            "benefits": [
                "Competitive salary + equity",
                "Remote-first culture",
                "Annual learning budget",
                "Health & wellness benefits"
            ],
            "accent_color": "yellow"
        },
        {
            "title": "Prompt Engineer & Philosopher",
            "location": "Hybrid",
            "location_type": "HYBRID",
            "description": "Find the right words to make machines dream. You'll craft prompts that push the boundaries of what AI can create and understand.",
            "requirements": [
                "Deep understanding of LLMs and prompt engineering",
                "Background in linguistics or philosophy preferred",
                "Creative writing skills",
                "Experience with AI safety and ethics"
            ],
            "benefits": [
                "Flexible working hours",
                "Stock options",
                "Conference attendance",
                "Mental health support"
            ],
            "accent_color": "blue"
        }
    ]
    
    for job_data in initial_jobs:
        job = Job(**job_data)
        doc = serialize_datetime(job.model_dump())
        await db.jobs.insert_one(doc)
    
    return {"message": f"Seeded {len(initial_jobs)} jobs"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
