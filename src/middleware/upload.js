const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Read the base directory from the .env file (Adapts to PC or Surface Pro automatically!)
const baseUploadDir = process.env.UPLOAD_DIRECTORY || path.join(__dirname, '../../uploads');

// Build the specific folders based on that root directory
const videoDir = path.join(baseUploadDir, 'videos');
const subDir = path.join(baseUploadDir, 'subtitles');
const thumbDir = path.join(baseUploadDir, 'thumbnails');

if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

// 2. Configure where and how files are saved
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'video') {
            cb(null, videoDir);
        } else if (file.fieldname === 'subtitle') {
            cb(null, subDir);
        } else if (file.fieldname === 'thumbnail' || file.fieldname === 'series_poster') {
            cb(null, thumbDir);
        } else {
            // THE FIX: Now using the dynamic baseUploadDir instead of a hardcoded D: drive
            cb(new Error('Unexpected file field'), baseUploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 3. Strict File Filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'video') {
        if (file.mimetype === 'video/mp4' || file.mimetype === 'video/webm') {
            cb(null, true);
        } else {
            cb(new Error('Only .mp4 and .webm video formats are allowed!'), false);
        }
    } else if (file.fieldname === 'subtitle') {
        if (file.mimetype === 'text/vtt' || file.originalname.toLowerCase().endsWith('.vtt')) {
            cb(null, true);
        } else {
            cb(new Error('Only .vtt format is allowed for subtitles!'), false);
        }
    } else if (file.fieldname === 'thumbnail' || file.fieldname === 'series_poster') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPG, PNG, WebP) are allowed for images!'), false);
        }
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;