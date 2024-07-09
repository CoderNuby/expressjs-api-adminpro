const { Router } = require("express");
const { check } = require("express-validator");
const { validationFields } = require("../middlewares/validation-fields");
const { validationJsonWebToken } = require("../middlewares/validation-jsonWebToken");
const { 
    getMedicalDoctors,
    createMedicalDoctor,
    updateMedicalDoctor,
    deleteMedicalDoctor, 
    getMedicalDoctor} = require("../controllers/medical-doctors");

const router = Router();

router.get("/", validationJsonWebToken, getMedicalDoctors);

router.get("/:id", validationJsonWebToken, getMedicalDoctor);

router.post("/", [
    validationJsonWebToken,
    check("name", "Name is require").not().isEmpty(),
    check("hospitalId", "Hospital Id is require").not().isEmpty(),
    check("hospitalId", "Hospital Id should be a Mongo Id").isMongoId(),
    validationFields
], createMedicalDoctor);

router.put("/:id", [
    validationJsonWebToken,
    check("name", "Name is require").not().isEmpty(),
    validationFields
], updateMedicalDoctor);

router.delete("/:id", validationJsonWebToken, deleteMedicalDoctor);


module.exports = router;