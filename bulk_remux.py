import os
import subprocess
import stat

def recursive_remux(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for filename in files:
            if filename.endswith(".mkv"):
                mkv_path = os.path.join(root, filename)
                mp4_path = os.path.join(root, filename.rsplit('.', 1)[0] + ".mp4")

                print(f"\n--- Processing: {filename} ---")

                # The fully optimized web-streaming FFmpeg command
                command = [
                    'ffmpeg',
                    '-v', 'warning',
                    '-i', mkv_path,
                    '-map', '0:v',           # Grab video
                    '-map', '0:a',           # Grab audio (drops incompatible PGS subtitles)
                    '-c', 'copy',            # Instant copy, no re-encoding!
                    '-movflags', '+faststart', # Fixes the 20-second Cloudflare buffer
                    '-y',
                    mp4_path
                ]

                try:
                    subprocess.run(command, check=True)
                    print(f"✅ Success: Web-Optimized MP4 created.")

                    # Fix the Windows Read-Only issue, then delete the old MKV
                    os.chmod(mkv_path, stat.S_IWRITE)
                    os.remove(mkv_path)
                    print("🗑️ Deleted original MKV.")

                except subprocess.CalledProcessError:
                    print(f"❌ ERROR: FFmpeg failed on {filename}.")
                    # Clean up the broken MP4 if it fails
                    if os.path.exists(mp4_path):
                        os.remove(mp4_path)
                except FileNotFoundError:
                    print("ERROR: FFmpeg not found. Ensure it is in your System PATH.")
                    return

if __name__ == "__main__":
    current_folder = os.getcwd()
    print(f"Starting lightning-fast remux and web-optimization in: {current_folder}")
    recursive_remux(current_folder)