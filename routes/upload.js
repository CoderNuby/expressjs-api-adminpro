const { Router } = require("express");
const { validationJsonWebToken } = require("../middlewares/validation-jsonWebToken");
const { fileUpload } = require("../controllers/uploads");
const  expressFileUpload = require("express-fileupload");


const router = Router();

router.use(expressFileUpload());

router.post("/:collection/:id", validationJsonWebToken, fileUpload);


module.exports = router;