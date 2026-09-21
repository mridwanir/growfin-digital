from typing import List, Optional
from pydantic import BaseModel, Field

class MenuItem(BaseModel):
    id: int
    name: str
    desc: str
    price: str
    tag: Optional[str] = None
    category: str
    imageUrl: Optional[str] = None

class SampleChat(BaseModel):
    user: str
    doctor: str
    recommendationTitle: str
    recommendationDesc: str

class DoctorInfo(BaseModel):
    name: str
    role: str
    avatarEmoji: str = "👩‍⚕️"
    avatarUrl: str = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80"
    sampleChat: SampleChat

class ReviewInfo(BaseModel):
    authorName: str
    rating: int
    text: str
    time: Optional[str] = None

class BusinessDemo(BaseModel):
    name: str
    category: str
    city: str
    rating: float
    reviewCount: int
    phone: str
    address: str
    googleMapsUrl: str
    hours: str = "Senin - Sabtu: 09:00 - 20:00"
    waNumber: str
    tagline: str
    iconEmoji: str = Field(default="🩺")
    doctor: DoctorInfo
    categories: List[str]
    menu: List[MenuItem]
    reviews: Optional[List[ReviewInfo]] = None