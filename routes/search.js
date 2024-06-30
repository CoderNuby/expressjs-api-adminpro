const { Router } = require("express");
const { validationJsonWebToken } = require("../middlewares/validation-jsonWebToken");
const { searchFromAll, searchFromCollection } = require("../controllers/searches");


const router = Router();

router.get("/:keyword", validationJsonWebToken, searchFromAll);
router.get("/collections/:collection/:keyword", validationJsonWebToken, searchFromCollection);

module.exports = router;