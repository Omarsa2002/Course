const multer = require("multer");
const appErrors =   require('../utils/Errors');
const STATUS = require("../utils/HttpStatusText");

const diskStorage = multer.diskStorage({
    destination: function (req, file,  cb) {
        console.log(file);
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${req.body.firstName}-${Date.now()}.${ext}`;
        console.log(fileName);
        cb(null, fileName);
    }
});
const fileFilter = function (req, file, cb) {
    const type = file.mimetype.split('/')[0];
    return (type === 'image')? cb(null, true):cb(appErrors.create(400, STATUS.fail, "This is not an image"), false);
}

const upload  = multer({
    storage: diskStorage,
    fileFilter
});

module.exports =  {
    diskStorage,
    fileFilter,
    upload
}