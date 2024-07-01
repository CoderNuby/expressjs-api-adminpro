const { Router } = require("express");
const { check } = require("express-validator");
const { validationFields } = require("../middlewares/validation-fields");
const { loginUser, loginGoogleUser, renewToken } = require("../controllers/auths");
const { validationJsonWebToken } = require("../middlewares/validation-jsonWebToken");

const router = Router();

router.post("/login", [
    check("password", "Password is require").not().isEmpty(),
    check("email", "Email is require").not().isEmpty(),
    check("email", "This field should be type email").isEmail(),
    validationFields
], loginUser);

router.post("/google", [
    check("token", "Google Token is require").not().isEmpty(),
    validationFields
], loginGoogleUser);

router.get("/tokenRenew", [
    validationJsonWebToken,
    validationFields
], renewToken);

router.put("/register", [
    validationFields
]);


module.exports = router;

