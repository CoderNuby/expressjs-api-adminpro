const { Router } = require("express");
const { getUsers, createUser, updateUser } = require("../controllers/users");
const { check } = require("express-validator");
const { validationFields } = require("../middlewares/validation-fields");

const router = Router();

router.get("/", getUsers);

router.post("/", [
    check("name", "Name is require").not().isEmpty(),
    check("password", "Password is require").not().isEmpty(),
    check("email", "Email is require").not().isEmpty(),
    check("email", "This field should be type email").isEmail(),
    validationFields
], createUser);

router.put("/:id", [
    check("name", "Name is require").not().isEmpty(),
    check("email", "Email is require").not().isEmpty(),
    check("role", "Role is require").not().isEmpty(),
    check("email", "This field should be type email").isEmail(),
    validationFields
], updateUser);


module.exports = router;