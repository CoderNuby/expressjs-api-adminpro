const { Router } = require("express");
const { check } = require("express-validator");
const { validationFields } = require("../middlewares/validation-fields");
const { authUser } = require("../controllers/auths");

const router = Router();

router.post("/login", [
    check("password", "Password is require").not().isEmpty(),
    check("email", "Email is require").not().isEmpty(),
    check("email", "This field should be type email").isEmail(),
    validationFields
], authUser);

router.put("/register", [
    validationFields
], authUser);


module.exports = router;

