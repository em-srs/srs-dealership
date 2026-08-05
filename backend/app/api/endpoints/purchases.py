from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.purchase import PurchaseResponse
from app.api.deps import get_current_user
from app.services.purchase import get_user_purchases

router = APIRouter()

@router.get("/me", response_model=List[PurchaseResponse], status_code=status.HTTP_200_OK)
def get_my_purchases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetches the purchase history for the currently authenticated user.
    Connected to: Frontend Navbar / User Dashboard / Purchase History Modal (GET /api/purchases/me)
    Requires: Database Session (get_db), get_current_user dependency, get_user_purchases service
    """
    return get_user_purchases(db=db, user_id=current_user.id)
