from pydantic import BaseModel, EmailStr
from typing import Optional, List
from app.models import models


class UserBase(BaseModel):
    email: EmailStr
    display_name: str


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    role: models.UserRole

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class KBArticleBase(BaseModel):
    title: str
    slug: str
    category: Optional[str] = None
    content: str


class KBArticleCreate(KBArticleBase):
    is_published: bool = False


class KBArticleOut(KBArticleBase):
    id: int
    is_published: bool

    class Config:
        from_attributes = True


class TicketBase(BaseModel):
    subject: str
    category: Optional[str] = None
    priority: models.TicketPriority = models.TicketPriority.medium


class TicketCreate(TicketBase):
    message: str


class TicketMessageCreate(BaseModel):
    message: str
    is_internal_note: bool = False


class TicketMessageOut(BaseModel):
    id: int
    message: str
    is_internal_note: bool
    author_role: models.UserRole

    class Config:
        from_attributes = True


class TicketOut(TicketBase):
    id: int
    status: models.TicketStatus
    messages: List[TicketMessageOut] = []

    class Config:
        from_attributes = True


class ApiDocBase(BaseModel):
    title: str
    slug: str
    content: str
    order_index: int = 0


class ApiDocCreate(ApiDocBase):
    is_published: bool = True


class ApiDocOut(ApiDocBase):
    id: int
    is_published: bool

    class Config:
        from_attributes = True
