import re
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from config.settings import MIN_RATING, MIN_REVIEWS, SUPABASE_URL, SUPABASE_KEY
from services.maps_service import search_health_clinics # NOTE: function name is kept but it searches INCLUDED_TYPES
from services.ai_service import generate_demo_data_ai
from services.telegram_service import send_telegram_msg
from services.storage_service import export_leads_to_excel, save_scan_history

load_dotenv()

# Inisialisasi Supabase
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"⚠️ Peringatan: Gagal koneksi ke Supabase: {e}")
else:
    print("⚠️ Peringatan: Kredensial Supabase tidak lengkap (SUPABASE_URL atau SUPABASE_KEY kosong).")


def format_slug(name: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", "", name.lower())
    return re.sub(r"\s+", "-", cleaned).strip("-")


def run_outreach_pipeline(lat: float, lng: float, radius: int, city: str):
    print(f"\n🏢 Memindai area {city} ({lat}, {lng}) radius {radius}m...")
    places = search_health_clinics(lat, lng, radius)
    print(f"📍 Ditemukan {len(places)} entitas bisnis potensial.")

    leads_data = []
    hot_leads_count = 0

    for p in places:
        name = p.get("displayName", {}).get("text", "Unknown")
        rating = p.get("rating", 0.0)
        reviews = p.get("userRatingCount", 0)
        address = p.get("formattedAddress", "-")
        website = p.get("websiteUri", "")
        phone = p.get("internationalPhoneNumber", "-")
        maps_link = p.get("googleMapsUri", "")
        reviews_data = p.get("reviews", [])
        primary_type = p.get("primaryType", "bisnis")
        slug = format_slug(name)

        is_no_proper_website = (
            not website 
            or any(domain in website for domain in ["google.com", "instagram.com", "linktr.ee", "tiktok.com"])
        )
        is_high_reputation = rating >= MIN_RATING and reviews >= MIN_REVIEWS

        if is_no_proper_website and is_high_reputation:
            lead_status = "🔥 HOT LEAD"
            print(f"✨ Memproses Hot Lead: {name} ({rating}⭐) - Tipe: {primary_type}...")

            # 1. Cek duplikasi di Supabase
            is_duplicate = False
            if supabase:
                try:
                    res = supabase.table("business_demos").select("slug").eq("slug", slug).execute()
                    if len(res.data) > 0:
                        print(f"ℹ️ Lead {name} ({slug}) sudah ada di database. Lewati AI Generation.")
                        is_duplicate = True
                except Exception as e:
                    print(f"⚠️ Gagal cek Supabase: {e}")

            if not is_duplicate:
                hot_leads_count += 1
                demo_metadata = generate_demo_data_ai(name, rating, reviews, phone, address, maps_link, slug, city, reviews_data)
                
                if demo_metadata and supabase:
                    clean_phone = re.sub(r'[^0-9]', '', phone) if phone else "628123456789"
                    if clean_phone.startswith('0'):
                        clean_phone = '62' + clean_phone[1:]
                        
                    # Insert data baru ke tabel business_demos
                    try:
                        supabase.table("business_demos").insert({
                            "slug": slug,
                            "name": name,
                            "category": primary_type.replace("_", " ").title(),
                            "phone": clean_phone,
                            "city": city,
                            "maps_url": maps_link,
                            "metadata": demo_metadata
                        }).execute()
                        print(f"✅ Berhasil menyimpan {name} ke database Supabase!")
                    except Exception as e:
                        print(f"❌ Gagal insert ke database: {e}")

                tele_msg = (
                    f"🚀 *LEAD BISNIS BARU TERSIMPAN!*\n\n"
                    f"🏷️ *{name}*\n"
                    f"🏢 Kategori: {primary_type.replace('_', ' ').title()}\n"
                    f"⭐ Rating: {rating} ({reviews} ulasan)\n"
                    f"📍 Alamat: {address}\n"
                    f"📞 Kontak: `{phone}`\n"
                    f"🌐 Web Eksisting: {website or 'Tidak Ada'}\n"
                    f"🔗 Demo URL: `https://growfin.my.id/demo/{slug}`\n"
                    f"🗺️ Maps: [Buka Google Maps]({maps_link})\n"
                )
                send_telegram_msg(tele_msg)
        else:
            lead_status = "Biasa / Sudah Ada Web"

        leads_data.append({
            "Nama Bisnis": name,
            "Kategori Status": lead_status,
            "Tipe Utama": primary_type,
            "Rating": rating,
            "Jumlah Ulasan": reviews,
            "No Telepon": phone,
            "Website Eksisting": website or "TIDAK ADA",
            "Alamat": address,
            "Slug Demo": slug,
            "Link Google Maps": maps_link
        })

    excel_file = export_leads_to_excel(leads_data, city=city, lat=lat, lng=lng)
    save_scan_history(city=city, lat=lat, lng=lng, radius=radius)

    send_telegram_msg(
        f"✅ *Scan Ekosistem Selesai!*\n"
        f"🏙️ Kota: {city}\n"
        f"📊 Total Terpindai: {len(places)}\n"
        f"🔥 Hot Leads Disimpan: {hot_leads_count}\n"
        f"📁 File Excel: `{excel_file}`"
    )