import os
import subprocess


def convert_srt_to_vtt(root_dir):
    # Walk through the current folder and all subfolders
    for root, dirs, files in os.walk(root_dir):
        for filename in files:
            if filename.endswith(".srt"):
                srt_path = os.path.join(root, filename)
                # Create the new filename with a .vtt extension
                vtt_path = os.path.join(root, filename.rsplit('.', 1)[0] + ".vtt")

                print(f"--- Converting: {filename} ---")

                # The FFmpeg command to convert subtitles
                command = [
                    'ffmpeg',
                    '-i', srt_path,
                    '-y',  # Automatically overwrite if the VTT already exists
                    vtt_path
                ]

                try:
                    # capture_output=True keeps the terminal clean from FFmpeg's massive text logs
                    subprocess.run(command, check=True, capture_output=True)
                    print(f"DONE: Saved to {root}")

                except subprocess.CalledProcessError as e:
                    print(f"ERROR on {filename}: Subtitle conversion failed.")
                except FileNotFoundError:
                    print("ERROR: FFmpeg not found in PATH.")
                    return


if __name__ == "__main__":
    current_folder = os.getcwd()
    print(f"Starting SRT to VTT conversion in: {current_folder}")
    convert_srt_to_vtt(current_folder)