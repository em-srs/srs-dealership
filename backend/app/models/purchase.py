from sqlalchemy import Column, Integer, String, Numeric, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class PurchaseHistory(Base):
    __tablename__ = "purchase_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id", ondelete="SET NULL"), nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    price_at_purchase = Column(Numeric(10, 2), nullable=False)
    buyer_name = Column(String(255), nullable=False)
    buyer_phone = Column(String(50), nullable=False)
    delivery_address = Column(Text, nullable=False)
    note = Column(Text, nullable=True)
    purchased_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="purchases")
    vehicle = relationship("Vehicle", backref="purchases")
