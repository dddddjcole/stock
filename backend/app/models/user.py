from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    display_name: str | None = None

class UserOut(BaseModel):
    id: int
    email: str
    role: str
    display_name: str | None
    is_active: int
    created_at: str

class LoginIn(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str | None = None
    password: str = Field(min_length=6)
    display_name: str | None = None
