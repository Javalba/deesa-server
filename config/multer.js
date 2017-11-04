// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/uploads/')
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}${path.extname(file.originalname)}`)
//   }
// });

const path      = require('path');
const multer    = require('multer');
const aws       = require('aws-sdk');
const multerS3  = require('multer-s3');

aws.config.region = 'eu-central-1';
aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

let s3 = new aws.S3();

const uploadAvatar = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'deesa/avatars',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now() + '.jpg');
        }
    })
});

const uploadDesign = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'deesa/designs',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now() + '.png');
        }
    })
});


module.exports = {
    uploadAvatar, 
    uploadDesign
};