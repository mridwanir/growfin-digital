import os
import sys
import json
import codecs
import requests
from pathlib import Path
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv

# Fix Windows charmap error by forcing UTF-8 stdout
if sys.platform == "win32":
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

# Import the core logic for the pipeline
from core.pipeline import run_outreach_pipeline

load_dotenv()

app = Flask(__name__)
CORS(app)

HISTORY_FILE = Path("scan_history.json")

@app.route('/')
def index():
    carto_api_key = os.getenv("CARTO_API_KEY", "")
    return render_template('index.html', carto_api_key=carto_api_key)

@app.route('/api/history', methods=['GET'])
def get_history():
    if not HISTORY_FILE.exists():
        return jsonify([])
    
    try:
        content = HISTORY_FILE.read_text(encoding="utf-8")
        history = json.loads(content)
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/preview', methods=['GET'])
def preview_osm():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    radius = request.args.get('radius')
    
    if not all([lat, lng, radius]):
        return jsonify({"error": "Missing parameters"}), 400
        
    query = f"""
    [out:json][timeout:35];
    (
      node["amenity"~"clinic|dentist|doctors"](around:{radius},{lat},{lng});
      way["amenity"~"clinic|dentist|doctors"](around:{radius},{lat},{lng});
      node["healthcare"](around:{radius},{lat},{lng});
      way["healthcare"](around:{radius},{lat},{lng});
    );
    out center;
    """
    
    headers = {'User-Agent': 'GrowfinDigitalScanner/1.0'}
    
    # List of Overpass API mirrors
    endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter"
    ]
    
    resp = None
    for url in endpoints:
        try:
            resp = requests.get(url, params={'data': query}, headers=headers, timeout=40)
            if resp.status_code == 200:
                break
        except requests.exceptions.RequestException:
            continue
            
    try:
        if resp and resp.status_code == 200:
            data = resp.json()
            elements = data.get('elements', [])
            
            # Categorize the results
            results = []
            for e in elements:
                tags = e.get('tags', {})
                amenity = tags.get('amenity', '')
                healthcare = tags.get('healthcare', '')
                
                category = "Umum/Lainnya"
                if amenity == "dentist" or healthcare == "dentist":
                    category = "Klinik Gigi"
                elif amenity == "doctors" or healthcare == "doctor":
                    category = "Dokter"
                elif amenity == "clinic" or healthcare == "clinic":
                    category = "Klinik"
                
                # Check name for skincare heuristics since OSM doesn't have a strict skincare tag usually
                name = tags.get('name', '').lower()
                if 'skin' in name or 'kecantikan' in name or 'beauty' in name or 'aesthetic' in name:
                    category = "Skincare/Aesthetic"
                    
                lat_coord = e.get('lat') or e.get('center', {}).get('lat')
                lng_coord = e.get('lon') or e.get('center', {}).get('lon')
                
                if lat_coord and lng_coord:
                    results.append({
                        "id": e.get('id'),
                        "name": tags.get('name', 'Tanpa Nama'),
                        "category": category,
                        "lat": lat_coord,
                        "lng": lng_coord
                    })
                    
            return jsonify({"status": "success", "data": results})
        else:
            return jsonify({"error": f"OSM API Error {resp.status_code}", "details": resp.text}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/scan', methods=['POST'])
def scan_area():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    city = data.get('city')
    lat = data.get('lat')
    lng = data.get('lng')
    radius = data.get('radius')
    
    if not all([city, lat, lng, radius]):
        return jsonify({"error": "Missing required fields: city, lat, lng, radius"}), 400
        
    try:
        # Convert types
        lat = float(lat)
        lng = float(lng)
        radius = int(radius)
        
        print(f"[INFO] Memulai scan via Web UI: {city} ({lat}, {lng}) - {radius}m")
        
        # Run the existing pipeline logic
        # It takes: lat, lng, radius, city
        run_outreach_pipeline(lat, lng, radius, city)
        
        return jsonify({
            "status": "success",
            "message": f"Scan untuk area {city} berhasil diselesaikan!"
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Pastikan folder templates ada
    Path("templates").mkdir(exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
