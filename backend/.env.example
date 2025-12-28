from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import models
from app.schemas import schemas

router = APIRouter(tags=["docs"], prefix="/docs")


@router.get("", response_model=List[schemas.ApiDocOut])
def list_docs(db: Session = Depends(get_db)):
    return (
        db.query(models.ApiDocSection)
        .filter(models.ApiDocSection.is_published.is_(True))
        .order_by(models.ApiDocSection.order_index)
        .all()
    )


@router.get("/{slug}", response_model=schemas.ApiDocOut)
def get_doc(slug: str, db: Session = Depends(get_db)):
    doc = (
        db.query(models.ApiDocSection)
        .filter(
            models.ApiDocSection.slug == slug,
            models.ApiDocSection.is_published.is_(True),
        )
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Doc not found")
    return doc


def require_staff(user: models.User = Depends(get_current_user)):
    if user.role not in (models.UserRole.staff, models.UserRole.admin):
        raise HTTPException(status_code=403, detail="Staff access required")
    return user


@router.post("/staff", response_model=schemas.ApiDocOut, status_code=201)
def create_doc(
    payload: schemas.ApiDocCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_staff),
):
    doc = models.ApiDocSection(**payload.model_dump())
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc
