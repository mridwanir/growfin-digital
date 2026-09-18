import sys
from config.settings import DEFAULT_RADIUS, DEFAULT_CITY, DEFAULT_LATITUDE, DEFAULT_LONGITUDE
from core.pipeline import run_outreach_pipeline

def parse_coordinates(coord_input: str):
    """Parsing input koordinat fleksibel ('lat, lng' atau 'lat lng')"""
    try:
        parts = [p.strip() for p in coord_input.replace(",", " ").split() if p.strip()]
        if len(parts) >= 2:
            return float(parts[0]), float(parts[1])
    except ValueError:
        pass
    return None, None

def main():
    print("=" * 55)
    print("🚀 GROWFIN LOCAL OUTREACH AUTOMATION")
    print("=" * 55)

    # 1. Input Kota
    city_input = input(f"🏙️ Masukkan Nama Kota [{DEFAULT_CITY}]: ").strip()
    city = city_input if city_input else DEFAULT_CITY

    # 2. Input Koordinat
    default_coord_str = f"{DEFAULT_LATITUDE}, {DEFAULT_LONGITUDE}"
    coord_input = input(f"📍 Masukkan Koordinat Lat, Lng [{default_coord_str}]: ").strip()

    if not coord_input:
        lat, lng = DEFAULT_LATITUDE, DEFAULT_LONGITUDE
    else:
        lat, lng = parse_coordinates(coord_input)
        if lat is None or lng is None:
            print("❌ Format koordinat tidak valid! Contoh format yang benar: -6.944312, 107.590557")
            sys.exit(1)

    # 3. Input Radius (Opsional, tekan Enter untuk default 3500m)
    radius_input = input(f"📏 Masukkan Radius meter [{DEFAULT_RADIUS}m]: ").strip()
    radius = int(radius_input) if radius_input.isdigit() else DEFAULT_RADIUS

    print("-" * 55)
    print(f"Target Kota     : {city}")
    print(f"Titik Koordinat : {lat}, {lng}")
    print(f"Radius Scan     : {radius} meter")
    print("-" * 55)

    run_outreach_pipeline(lat=lat, lng=lng, radius=radius, city=city)

if __name__ == "__main__":
    main()