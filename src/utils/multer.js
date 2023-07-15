const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file, cb) => {
        return {
            folder: 'profile',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp', 'mp3', 'mp4'],
            transformation: [
                { width: 500, height: 500, crop: 'fill' },
            ],
            path: file.path,
        };
    },
});


const upload = multer({ storage: storage });

module.exports = upload;

