from sqlalchemy.orm import Mapped, mapped_column
from database import Model

class UserModel(Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    username: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]
    role: Mapped[str]
    total_spent: Mapped[float] = mapped_column(default=0.0)
    bonus_points: Mapped[int] = mapped_column(default=0)
    discount_type: Mapped[str] = mapped_column(default='discount10')

