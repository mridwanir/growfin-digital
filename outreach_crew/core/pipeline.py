import re
from config.settings import MIN_RATING, MIN_REVIEWS
from services.maps_service import search_health_clinics
from services.ai_service import generate_clinic_pitch, generate_demo_data_ai
from services.injector_service import append_to_demos_ts
from services.telegram_service import send_telegram_msg
from services.storage_service import export_leads_to_excel
from services.git_service import auto_git_push

def format_slug(name: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", "", name.lower())
    return re.sub(r"\s+", "-", cleaned).strip("-")

def run_outreach_pipeline(lat: float, lng: float, radius: int, city: str):
    print(f"\n🏥 Memindai area {city} ({lat}, {lng}) radius {radius}m...")
    places = search_health_clinics(lat, lng, radius)
    print(f"📍 Ditemukan {len(places)} fasilitas kesehatan.")

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
        slug = format_slug(name)

        is_no_proper_website = (
            not website 
            or any(domain in website for domain in ["google.com", "instagram.com", "linktr.ee", "tiktok.com"])
        )
        is_high_reputation = rating >= MIN_RATING and reviews >= MIN_REVIEWS

        if is_no_proper_website and is_high_reputation:
            lead_status = "🔥 HOT LEAD"
            hot_leads_count += 1
            print(f"✨ Memproses Hot Lead: {name} ({rating}⭐)...")

            demo_model = generate_demo_data_ai(name, rating, reviews, phone, address, maps_link, slug, city)
            if demo_model:
                append_to_demos_ts(slug, demo_model)

            pitch_text = generate_clinic_pitch(name, rating, reviews, address, slug)

            tele_msg = (
                f"🏥 *HOT LEAD KLINIK BARU!*\n\n"
                f"🏷️ *{name}*\n"
                f"⭐ Rating: {rating} ({reviews} ulasan)\n"
                f"📍 Alamat: {address}\n"
                f"📞 Kontak: `{phone}`\n"
                f"🌐 Web Eksisting: {website or 'Tidak Ada'}\n"
                f"🔗 Demo URL: `https://growfin.my.id/demo/{slug}`\n"
                f"🗺️ Maps: [Buka Google Maps]({maps_link})\n\n"
                f"📝 *Draf WhatsApp Outreach:*\n```\n{pitch_text}\n```"
            )
            send_telegram_msg(tele_msg)
        else:
            lead_status = "Biasa / Sudah Ada Web"
            pitch_text = "-"

        leads_data.append({
            "Nama Klinik": name,
            "Kategori Status": lead_status,
            "Rating": rating,
            "Jumlah Ulasan": reviews,
            "No Telepon": phone,
            "Website Eksisting": website or "TIDAK ADA",
            "Alamat": address,
            "Slug Demo": slug,
            "Draft WhatsApp Outreach": pitch_text,
            "Link Google Maps": maps_link
        })

    excel_file = export_leads_to_excel(leads_data, city=city, lat=lat, lng=lng)

    if hot_leads_count > 0:
        print(f"\n📦 Melakukan auto-push untuk {hot_leads_count} lead baru...")
        auto_git_push(f"feat: auto-inject {hot_leads_count} clinic leads ({city})")
        send_telegram_msg(f"🚀 *Deployment:* {hot_leads_count} klinik baru telah di-push ke GitHub & sedang live!")

    send_telegram_msg(
        f"✅ *Pipeline Selesai!*\n"
        f"🏙️ Kota: {city}\n"
        f"📊 Total Terpindai: {len(places)}\n"
        f"🔥 Hot Leads: {hot_leads_count}\n"
        f"📁 File Excel: `{excel_file}`"
    )