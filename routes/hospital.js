const { Router } = require("express");
const { check } = require("express-validator");
const { validationFields } = require("../middlewares/validation-fields");
const { validationJsonWebToken } = require("../middlewares/validation-jsonWebToken");
const { 
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital } = require("../controllers/hospitals");

const router = Router();

router.get("/", validationJsonWebToken, getHospitals);

router.post("/", [
    validationJsonWebToken,
    check("name", "Name is require").not().isEmpty(),
    validationFields
], createHospital);

router.put("/:id", [
    validationJsonWebToken,
    check("name", "Name is require").not().isEmpty(),
    validationFields
], updateHospital);

router.delete("/:id", validationJsonWebToken, deleteHospital);


module.exports = router;