import subprocess
from pathlib import Path
from config.settings import PROJECT_WEB_DIR

def auto_git_push(commit_msg: str, cwd_path: Path = PROJECT_WEB_DIR) -> bool:
    try:
        subprocess.run(["git", "add", "lib/demos.ts"], cwd=cwd_path, check=True)
        status = subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=cwd_path)
        
        if status.returncode == 0:
            print("ℹ️ Tidak ada perubahan git yang perlu di-commit.")
            return True

        subprocess.run(["git", "commit", "-m", commit_msg], cwd=cwd_path, check=True)
        subprocess.run(["git", "push"], cwd=cwd_path, check=True)
        print("🚀 Auto-push git sukses. Vercel deployment triggered.")
        return True
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Git Error: {e}")
        return False