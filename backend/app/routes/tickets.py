from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import models
from app.schemas import schemas

router = APIRouter(tags=["tickets"], prefix="/tickets")


@router.post("", response_model=schemas.TicketOut, status_code=201)
def create_ticket(
    payload: schemas.TicketCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    ticket = models.Ticket(
        subject=payload.subject,
        category=payload.category,
        priority=payload.priority,
        student_id=current_user.id,
    )
    db.add(ticket)
    db.flush()  # get id before commit

    msg = models.TicketMessage(
        ticket_id=ticket.id,
        author_id=current_user.id,
        author_role=current_user.role,
        message=payload.message,
        is_internal_note=False,
    )
    db.add(msg)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.get("", response_model=List[schemas.TicketOut])
def list_tickets(
    status: Optional[models.TicketStatus] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    q = db.query(models.Ticket)
    if current_user.role == models.UserRole.student:
        q = q.filter(models.Ticket.student_id == current_user.id)
    if status:
        q = q.filter(models.Ticket.status == status)
    if category:
        q = q.filter(models.Ticket.category == category)
    return q.all()
