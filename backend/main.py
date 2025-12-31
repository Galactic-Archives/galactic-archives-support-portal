from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.core.config import settings
from app.routes import auth, kb, tickets, docs

Base.metadata.drop_all(bind=engine)  # Drop existing tables to recreate with new schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Support portal for Galactic Archives",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "https://galactic-archives-support-portal.onrender.com",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(kb.router, prefix="/api/v1")
app.include_router(tickets.router, prefix="/api/v1")
app.include_router(docs.router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "message": "Welcome to Galactic Archives Support Portal API",
        "version": settings.PROJECT_VERSION,
    }


@app.get("/health")
def health():
    return {"status": "ok"}
