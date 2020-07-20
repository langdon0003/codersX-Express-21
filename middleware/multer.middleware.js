const mutler = require('multer');

const storage = multer.memoryStorage();

exports.module.multerUploads = multer({storage}).single('avatar');