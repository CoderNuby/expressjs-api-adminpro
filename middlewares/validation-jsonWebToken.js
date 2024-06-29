const { response } = require("express");
const jsonwebtoken = require("jsonwebtoken");



function validationJsonWebToken(req, res = response, next) {

    const token = req.header("x-token");

    if(!token) {
        return res.status(401).json({
            ok: false,
            message: "Token is require"
        });
    }

    try {
        const { _id } = jsonwebtoken.verify(token, process.env.JWT_PRIVATE_KEY);

        req._id = _id;
        next();
    } catch (error) {
        return res.status().json({
            ok: false,
            message: "Invalid token"
        });
    }
}


module.exports = {
    validationJsonWebToken
}