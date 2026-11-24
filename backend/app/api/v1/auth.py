from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, UserResponse, Token
import hashlib

router = APIRouter(prefix="/auth", tags=["Authentication"])


def simple_hash(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar."
        )
    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=simple_hash(user_in.password),
        role="director"
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    if not user or user.password_hash != simple_hash(credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah."
        )
    return Token(
        access_token=f"token-{user.id}",
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(db: AsyncSession = Depends(get_db)):
    # Fallback to the first user or demo user
    result = await db.execute(select(User))
    user = result.scalars().first()
    if not user:
        user = User(
            name="Director User",
            email="director@researchverse.ai",
            password_hash=simple_hash("director123"),
            role="director"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user
