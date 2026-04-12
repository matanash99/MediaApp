# Kvalim Media Server 🎬

A personal, high-performance, self-hosted media streaming platform built with Node.js, Express, and SQLite. This project provides a complete, local Netflix-style experience with secure remote access via Cloudflare Zero Trust, robust process management, and automated metadata generation.

## ✨ Features

* **Full Media Streaming Engine:** Serves optimized `.mp4` video files, subtitles, and thumbnails directly to a custom frontend.
* **Secure Remote Access:** Integrates with Cloudflare Tunnels (`cloudflared`) to securely expose the local server to a public domain (`kvalim.win`) without opening router ports or exposing the local network.
* **24/7 Reliability:** Managed by PM2 as a background Windows service, ensuring the server automatically restarts on crashes or system reboots.
* **Automated Metadata Generation:** Includes a custom recursive Python script utilizing FFmpeg to automatically scan directories and generate high-quality thumbnails for new media files.
* **SQLite Database:** Lightweight, file-based database for managing user accounts, sessions, and media metadata.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** SQLite
* **Process Manager:** PM2
* **Networking/Security:** Cloudflare Zero Trust (Tunnels)
* **Media Processing:** Python 3, FFmpeg (`subprocess` automation)

## 📂 Project Structure

```text
MediaApp/
├── src/
│   └── models/
│       └── database.sqlite      # User and media database
├── uploads/
│   ├── videos/                  # Segmented by series/season (e.g., Entourage/Season 1/)
│   ├── subtitles/               # VTT/SRT subtitle files
│   └── thumbnails/              # (Optional) Centralized thumbnail storage
├── .env                         # Environment variables (Ignored in Git)
├── server.js                    # Main Express application entry point
├── auto_snap.py                 # Automated FFmpeg thumbnail script
└── package.json                 # Node dependencies
