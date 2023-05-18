const multer = require('multer');
const path = require('path');

exports.videoMulter = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== ".mp4" && ext !== ".mkv" && ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png" && ext !== ".avi" && ext !== ".MP4"){
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    }
}); 


exports.audioMulter = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== ".mp3" && ext !== ".aac" && ext !== ".aiff" && ext !== ".m4a" && ext !== ".ogg" && ext !== ".wav"){
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    }
}); 

exports.docsMulter = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== ".pdf" && ext !== ".txt" && ext !== ".word" && ext !== ".docm" && ext !== ".docx" && ext !== ".dot" && ext !== ".dotx" && ext !== ".doc" ){
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    }
}); 

exports.imageMulter = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== ".jpg" && ext !== ".png" && ext !== ".gif" && ext !== ".jpeg" && ext !== ".svg" ){
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    }
}); 