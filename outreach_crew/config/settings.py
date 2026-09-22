import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

# Project Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
PROJECT_WEB_DIR = Path(os.getenv("PROJECT_WEB_DIR", BASE_DIR / "frontend"))
DEMOS_TS_PATH = PROJECT_WEB_DIR / "lib" / "demos.ts"

# Load frontend env variables (which has NEXT_PUBLIC_SUPABASE_URL)
frontend_env = PROJECT_WEB_DIR / ".env.local"
if frontend_env.exists():
    load_dotenv(frontend_env)

# Default Coordinates & Radius
DEFAULT_LATITUDE = -6.932468057371051
DEFAULT_LONGITUDE = 107.64422442783128
DEFAULT_RADIUS = 3500
DEFAULT_CITY = "Bandung"

# Filter Criteria
MIN_RATING = 4.5
MIN_REVIEWS = 10
INCLUDED_TYPES = [
    # F&B
    "restaurant", "cafe", "coffee_shop", "bakery", "bar",
    # Personal Care & Grooming
    "beauty_salon", "barber_shop", "spa", "hair_care",
    # Daily Consumer Retail
    "pet_store", "veterinary_care", "florist", "pharmacy",
    # Activity & Leisure
    "gym", "sports_club", "car_wash"
]

# Supabase Config
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")