from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy import select
from database import SessionDep
from models.users import UserModel
from schemas.schemas import UserCreate, UserLogin, UserOut, UserUpdate
from auth.auth import get_current_user, get_password_hash, authenticate_user, create_access_token

router = APIRouter(prefix='/api', tags=['users'])

@router.post('/register')
async def register_user(user: UserCreate, db: SessionDep):
    result = await db.execute(select(UserModel).where(UserModel.username == user.username))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Имя пользователя уже занято')
    hashed = get_password_hash(user.password)
    db_user = UserModel(
        username=user.username,
        hashed_password=hashed,
        role=user.role,
        total_spent=0.0,
        bonus_points=0,
        discount_type='discount10'
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return {'message': 'Пользователь создан', 'user_id': db_user.id}

@router.post('/login')
async def procces_login(user: UserLogin, db: SessionDep):
    authenticated = await authenticate_user(db, user.username, user.password)
    if not authenticated:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Неверное имя пользователя или пароль')
    access_token = create_access_token(data={'sub': user.username})
    result = await db.execute(select(UserModel).where(UserModel.username == user.username))
    user_db = result.scalar_one_or_none()
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user': {
            'id': user_db.id,
            'username': user_db.username,
            'role': user_db.role,
            'total_spent': user_db.total_spent,
            'bonus_points': user_db.bonus_points,
            'discount_type': user_db.discount_type
        }
   }




@router.get('/me', response_model=UserOut)
async def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return current_user

@router.put('/me')
async def update_user(data: UserUpdate, db: SessionDep, current_user: UserModel = Depends(get_current_user)):
    if data.total_spent is not None:
        current_user.total_spent = data.total_spent
    if data.bonus_points is not None:
        current_user.bonus_points = data.bonus_points
    if data.discount_type is not None:
        current_user.discount_type = data.discount_type

    await db.commit()
    await db.refresh(current_user)
    return {'message': 'Пользователь обновлен', 'user': current_user}

