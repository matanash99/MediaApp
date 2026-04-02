import os
import subprocess

def run_universal_snaps():
    # 1. Get the directory where you are CURRENTLY running the script
    current_dir = os.getcwd()
    
    # Configuration
    TIMESTAMP = "00:05:00"
    
    print(f"📂 Scanning EVERYTHING inside: {current_dir}")
    print(f"📸 Snapshots set to: {TIMESTAMP}\n")

    for root, dirs, files in os.walk(current_dir):
        for filename in files:
            # We only care about .mp4 files
            if filename.lower().endswith(".mp4"):
                video_path = os.path.join(root, filename)
                
                # Name it exactly the same as the video, just .jpg
                base_name = os.path.splitext(filename)[0]
                thumb_path = os.path.join(root, f"{base_name}.jpg")

                # Skip if the thumbnail already exists
                if os.path.exists(thumb_path):
                    continue

                print(f"🎬 Found: {filename} -> Snapping...")

                # FFmpeg Command
                # -ss: Skip to 5 mins
                # -i: Input
                # -frames:v 1: Just one frame
                # -q:v 2: High quality
                command = [
                    'ffmpeg',
                    '-ss', TIMESTAMP,
                    '-i', video_path,
                    '-frames:v', '1',
                    '-q:v', '2',
                    '-y', 
                    thumb_path
                ]

                try:
                    # shell=True handles Windows PATH issues
                    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, shell=True)
                    print(f"   ✅ Saved: {base_name}.jpg")
                except subprocess.CalledProcessError:
                    # This usually happens if the video is shorter than 5 minutes
                    print(f"   ❌ Failed: Video might be shorter than {TIMESTAMP}")

if __name__ == "__main__":
    run_universal_snaps()
    print("\n🏁 Done! All available snapshots have been created.")