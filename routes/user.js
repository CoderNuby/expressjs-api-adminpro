const { Router } = require("express");
const { 
    getUsers,
    createUser, 
    updateUser,
    deleteUser } = require("../controllers/users");
const { check } = require("express-validator");
const { validationFields } = require("../middlewares/validation-fields");
const { validationJsonWebToken } = require("../middlewares/validation-jsonWebToken");

const router = Router();

router.get("/", validationJsonWebToken, getUsers);

router.post("/", [
    check("name", "Name is require").not().isEmpty(),
    check("password", "Password is require").not().isEmpty(),
    check("email", "Email is require").not().isEmpty(),
    check("email", "This field should be type email").isEmail(),
    validationFields
], createUser);

router.put("/:id", [
    validationJsonWebToken,
    check("name", "Name is require").not().isEmpty(),
    check("email", "Email is require").not().isEmpty(),
    check("role", "Role is require").not().isEmpty(),
    check("email", "This field should be type email").isEmail(),
    validationFields
], updateUser);

router.delete("/:id", validationJsonWebToken, deleteUser);


module.exports = router;