#!/bin/bash

# This enables recursive searching in pure Bash (looks in all sub-folders)
shopt -s globstar

echo "Starting massive FFmpeg faststart optimization..."

# Loop through every mp4 file natively
for file in **/*.mp4; do
    # Skip if no file is found
    [ -f "$file" ] || continue

    echo "------------------------------------------------"
    echo "Processing: $file"
    
    # Create a temporary filename
    tmp_file="${file%.mp4}_temp.mp4"
    
    # Run FFmpeg (MSYS_NO_PATHCONV tells Git Bash to stop messing with the paths!)
    MSYS_NO_PATHCONV=1 ffmpeg -v warning -i "$file" -c copy -movflags +faststart "$tmp_file" -y
    
    # Check if FFmpeg succeeded
    if [ $? -eq 0 ]; then
        mv "$tmp_file" "$file"
        echo "✅ Success: $file is now Web Optimized!"
    else
        echo "❌ Error: Something went wrong with $file"
        rm -f "$tmp_file"
    fi
done

echo "------------------------------------------------"
echo "🎉 All videos have been optimized!"