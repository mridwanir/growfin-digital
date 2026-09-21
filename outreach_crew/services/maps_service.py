import requests
from typing import List, Dict, Any
from config.settings import GOOGLE_MAPS_API_KEY, INCLUDED_TYPES

def search_health_clinics(lat: float, lng: float, radius_meters: int = 3500) -> List[Dict[str, Any]]:
    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": (
            "places.displayName,places.primaryType,places.rating,"
            "places.userRatingCount,places.formattedAddress,places.websiteUri,"
            "places.internationalPhoneNumber,places.googleMapsUri,places.reviews"
        )
    }
    payload = {
        "includedTypes": INCLUDED_TYPES,
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": float(radius_meters)
            }
        }
    }

    try:
        res = requests.post(url, headers=headers, json=payload, timeout=15)
        if res.status_code == 200:
            return res.json().get("places", [])
        print(f"❌ Error Places API ({res.status_code}): {res.text}")
        return []
    except Exception as e:
        print(f"⚠️ Request Places API gagal: {e}")
        return []