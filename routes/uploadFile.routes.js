const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");

router.post("/upload", fileUploader.single("img"), (req, res, next) => {
    if(!req.file) {
        next( new Error("No file uploaded!"));
        return;
    }

    res.json({ image: req.file.path });
});

module.exports = router;