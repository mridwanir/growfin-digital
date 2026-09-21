import json
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

try:
    import folium
except ImportError:
    print("❌ Library 'folium' belum ter-install. Silakan jalankan: pip install folium")
    exit(1)

HISTORY_FILE = Path("scan_history.json")
OUTPUT_HTML = "heatmap_scanned_area.html"

def generate_heatmap():
    if not HISTORY_FILE.exists():
        print(f"[WARNING] File {HISTORY_FILE} tidak ditemukan. Lakukan scan minimal satu kali.")
        return

    try:
        content = HISTORY_FILE.read_text(encoding="utf-8")
        history = json.loads(content)
    except Exception as e:
        print(f"[ERROR] Gagal membaca history: {e}")
        return

    if not history:
        print("[INFO] Riwayat scan masih kosong.")
        return

    # Hitung rata-rata titik untuk center peta
    avg_lat = sum(h["lat"] for h in history) / len(history)
    avg_lng = sum(h["lng"] for h in history) / len(history)

    print("[INFO] Membuat peta interaktif...")
    carto_api_key = os.getenv("CARTO_API_KEY")

    if carto_api_key:
        print("[INFO] Menggunakan Custom CARTO API Key.")
        # Menggunakan Voyager (seperti contoh dokumen) atau Positron sesuai selera
        tiles_url = f"https://basemaps.cartocdn.com/rastertiles/voyager/{{z}}/{{x}}/{{y}}.png?key={carto_api_key}"
        attr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
        m = folium.Map(location=[avg_lat, avg_lng], zoom_start=12, control_scale=True, tiles=tiles_url, attr=attr)
    else:
        print("[WARNING] CARTO_API_KEY tidak ditemukan di .env! Menggunakan default (mungkin ada watermark). Pastikan nama variabel di .env adalah CARTO_API_KEY.")
        m = folium.Map(location=[avg_lat, avg_lng], zoom_start=12, control_scale=True, tiles="CartoDB positron")

    for item in history:
        lat = item["lat"]
        lng = item["lng"]
        radius = item["radius"]
        city = item["city"]
        time_str = item["timestamp"]

        popup_text = f"<b>{city}</b><br>Radius: {radius}m<br>Waktu: {time_str}"
        
        # Tambahkan marker pusat
        folium.Marker(
            [lat, lng],
            popup=popup_text,
            tooltip=f"{city} (Click info)"
        ).add_to(m)

        # Tambahkan lingkaran cakupan
        folium.Circle(
            location=[lat, lng],
            radius=radius,
            color='red',
            fill=True,
            fill_color='red',
            fill_opacity=0.2,
            popup=popup_text
        ).add_to(m)

    m.save(OUTPUT_HTML)
    
    # Dapatkan path absolut untuk mempermudah pengguna membuka file
    abs_path = os.path.abspath(OUTPUT_HTML)
    print(f"[SUCCESS] Peta berhasil di-generate!")
    print(f"-> Buka file ini di browser Anda: file:///{abs_path.replace(chr(92), '/')}")

if __name__ == "__main__":
    generate_heatmap()
