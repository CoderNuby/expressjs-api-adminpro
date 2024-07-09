const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { updateImage } = require("../helpers/updateImage");


function fileUpload(req, res = response) {

    const collection = req.params.collection;
    const _id = req.params.id;

    const validCollections = ["hospitals", "medicalDoctors", "users"];

    try {
        if(!validCollections.includes(collection)){
            return res.status(400).json({
                ok: false,
                message: "Collection is not valid"
            });
        }
    
        if(!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                message: "No files were uploaded"
            });
        }
    
        if(req.files.image.length > 1) {
            return res.status(400).json({
                ok: false,
                message: "You can't upload multiple image"
            });
        }
    
        const file = req.files.image;
    
        const nameSplited = file.name.split(".");
        const fileExtension = nameSplited[nameSplited.length - 1];
    
        const validExtensions = ["png", "jpg", "jpeg", "gif"];
    
        if(!validExtensions.includes(fileExtension)){
            return res.status(400).json({
                ok: false,
                message: "Invalid file extension"
            });
        }
    
        const fileName = `${uuidv4()}.${fileExtension}`;
    
        const path = `./uploads/${collection}/${fileName}`;
    
        file.mv(path, async (err) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: "API error"
                });
            }
    
            const updateImageResponse = await updateImage(collection, _id, path, fileName);
    
            if(!updateImageResponse.ok){
                return res.status(404).json({
                    ok: false,
                    message: updateImageResponse.message
                });
            }
    
            res.status(201).json({
                ok: true,
                message: "Image Uploaded successful",
                imageName: fileName
            });
        });
    } catch (err) {
        return res.status(500).json({
            ok: true,
            message: "API error"
        });
    }
}

module.exports = {
    fileUpload
}