const { response } = require("express");
const { validationResult } = require("express-validator");



function validationFields(req, res = response, next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors
        });
    }

    next();
}

module.exports = {
    validationFields
}