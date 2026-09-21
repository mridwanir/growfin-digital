import os
import sys
import json
import codecs
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
