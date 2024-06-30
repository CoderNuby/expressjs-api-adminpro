const { response } = require("express");
const path = require("path");
const fs = require("fs");


function getImage(req, res = response) {

    const collection = req.params.collection;
    const image = req.params.image;

    const validCollections = ["hospitals", "medicalDoctors", "users"];

    if(!validCollections.includes(collection)){
        return res.status(400).json({
            ok: false,
            message: "Collection is not valid"
        });
    }
    
    try {
        let imagePath = path.join(__dirname, `../uploads/${collection}/${image}`);

        if(fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        }else {
            imagePath = path.join(__dirname, "../uploads/no-img.jpg");
            return res.sendFile(imagePath);
        }

    } catch (err) {
        return res.status(500).json({
            ok: true,
            message: "API error"
        });
    }
}

module.exports = {
    getImage
}