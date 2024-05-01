const router = require("express").Router();
const multer = require("multer");
const fileUploader = require("../config/cloudinary.config");
const upload = multer();
const cloudinary = require("cloudinary").v2;

router.post("/upload", fileUploader.single("img"), (req, res, next) => {
    if(!req.file) {
        next( new Error("No file uploaded!"));
        return;
    }

    res.json({ image: req.file.path });
});

router.post("/delete", upload.none(), (req, res, next) => {
    // console.log('REQ from the delete path ', req.body.publicIdOfCloudinary)
    const publicIdOfCloudinary = req.body.publicIdOfCloudinary;

    cloudinary.uploader.destroy(publicIdOfCloudinary, {invalidate: true});
    res.json({ return: true })
   
})
module.exports = router;