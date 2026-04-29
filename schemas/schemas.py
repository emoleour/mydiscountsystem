from pydantic import BaseModel

class UserCreate(BaseModel):

    username: str
    password: str
    role: str #физлицо или монтажник

class UserLogin(BaseModel):

    username: str
    password: str

class UserUpdate(BaseModel):

    total_spent: float | None = None
    bonus_points: int | None = None
    discount_type: str | None = None

class UserOut(BaseModel):
    id: int
    username: str
    role: str
    total_spent: float
    bonus_points: int
    discount_type: str