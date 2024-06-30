const { Router } = require("express");
const { validationJsonWebToken } = require("../middlewares/validation-jsonWebToken");
const  expressFileUpload = require("express-fileupload");
const { getImage } = require("../controllers/images");


const router = Router();

router.use(expressFileUpload());

router.get("/:collection/:image", validationJsonWebToken, getImage);


module.exports = router;