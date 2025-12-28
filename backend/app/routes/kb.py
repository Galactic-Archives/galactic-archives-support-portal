from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import models
from app.schemas import schemas

router = APIRouter(tags=["kb"], prefix="/kb")


@router.get("", response_model=List[schemas.KBArticleOut])
def list_articles(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(models.KnowledgeBaseArticle).filter(
        models.KnowledgeBaseArticle.is_published.is_(True)
    )
    if category:
        q = q.filter(models.KnowledgeBaseArticle.category == category)
    if search:
        like = f"%{search}%"
        q = q.filter(
            models.KnowledgeBaseArticle.title.ilike(like)
            | models.KnowledgeBaseArticle.content.ilike(like)
        )
    return q.order_by(models.KnowledgeBaseArticle.title).all()


@router.get("/{slug}", response_model=schemas.KBArticleOut)
def get_article(slug: str, db: Session = Depends(get_db)):
    article = (
        db.query(models.KnowledgeBaseArticle)
        .filter(
            models.KnowledgeBaseArticle.slug == slug,
            models.KnowledgeBaseArticle.is_published.is_(True),
        )
        .first()
    )
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


# Staff endpoints (simple role check)
def require_staff(user: models.User = Depends(get_current_user)):
    if user.role not in (models.UserRole.staff, models.UserRole.admin):
        raise HTTPException(status_code=403, detail="Staff access required")
    return user


@router.post("/staff", response_model=schemas.KBArticleOut)
def create_article(
    payload: schemas.KBArticleCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_staff),
):
    article = models.KnowledgeBaseArticle(**payload.model_dump())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article
