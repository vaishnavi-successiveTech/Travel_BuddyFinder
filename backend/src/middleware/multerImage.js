import multer from 'multer';
import path from 'path';

// Define storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/home/vaishnavi.gupta/Desktop/travelBuddy/frontend/public/uploads'); // Folder where you want to store the images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

export { upload };
