import json
from pathlib import Path
from config.settings import DEMOS_TS_PATH
from core.models import BusinessDemo

def append_to_demos_ts(slug: str, demo_model: BusinessDemo, file_path: Path = DEMOS_TS_PATH) -> bool:
    if not file_path.exists():
        print(f"⚠️ File tidak ditemukan: {file_path}")
        return False

    try:
        content = file_path.read_text(encoding="utf-8")

        if f'"{slug}":' in content or f"'{slug}':" in content:
            print(f"ℹ️ Slug '{slug}' sudah terdaftar di demos.ts.")
            return True

        data_dict = demo_model.model_dump(exclude_none=True)
        formatted_json = json.dumps(data_dict, indent=2, ensure_ascii=False)
        indented_lines = ["  " + line for line in formatted_json.splitlines()]
        formatted_entry = f'  "{slug}": ' + "\n".join(indented_lines).lstrip() + ",\n\n"

        target_str = "export const DEMO_DATA: Record<string, BusinessDemo> = {"
        if target_str in content:
            updated = content.replace(target_str, f"{target_str}\n{formatted_entry}")
            file_path.write_text(updated, encoding="utf-8")
            print(f"✅ Auto-inject sukses: {slug}")
            return True
        print(f"⚠️ Marker '{target_str}' tidak ditemukan.")
        return False
    except Exception as e:
        print(f"⚠️ Gagal inject demos.ts: {e}")
        return False