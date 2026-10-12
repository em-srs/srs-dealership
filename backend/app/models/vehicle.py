from sqlalchemy import Column, Integer, String, Numeric, DateTime, func, CheckConstraint
from app.db.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    maker = Column(String(100), nullable=False, index=True)
    model = Column(String(100), nullable=False, index=True)
    year = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("quantity >= 0", name="vehicles_quantity_check"),
        CheckConstraint("price >= 0", name="vehicles_price_check"),
        CheckConstraint("year >= 1886", name="vehicles_year_check"),
    )
