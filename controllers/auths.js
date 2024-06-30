const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJsonWebToken } = require("../helpers/jsonwebtoken");

async function authUser(req, res = response) {

    const { email, password } = req.body;

    try {

        const userDB = await User.findOne({email});

        if(!userDB){
            return res.status(404).json({
                ok: false,
                message: "Incorrect credentials"
            });
        }

        const validPassword = bcryptjs.compareSync(password, userDB.password);

        if(!validPassword){
            return res.status(404).json({
                ok: false,
                message: "Incorrect credentials"
            });
        }

        const token = await generateJsonWebToken(userDB._id);

        res.status(200).json({
            ok: true,
            message: "Login successful",
            token
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "API error"
        });
    }
}

module.exports = {
    authUser
}