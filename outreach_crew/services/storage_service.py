import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict
import pandas as pd

LEADS_DIR = Path("Leads")

def export_leads_to_excel(leads_data: List[Dict], city: str, lat: float, lng: float) -> str:
    # Buat folder Leads jika belum ada
    LEADS_DIR.mkdir(parents=True, exist_ok=True)

    city_slug = re.sub(r"[^a-zA-Z0-9]", "_", city.lower().strip())
    lat_str = f"lat{lat:.4f}"
    lng_str = f"lng{lng:.4f}"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Format nama file: leads_klinik_bandung_lat-6.9443_lng107.5906_20260831_212000.xlsx
    file_name = f"leads_klinik_{city_slug}_{lat_str}_{lng_str}_{timestamp}.xlsx"
    file_path = LEADS_DIR / file_name

    df = pd.DataFrame(leads_data)
    df.to_excel(file_path, index=False)
    
    print(f"📊 Rekapitulasi tersimpan di: {file_path}")
    return str(file_path)