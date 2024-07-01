const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJsonWebToken } = require("../helpers/jsonwebtoken");
const { googleVerify } = require("../helpers/google-verify");

async function loginUser(req, res = response) {

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

async function loginGoogleUser(req, res = response) {

    try {
        const { email, name, picture } = await googleVerify(req.body.token);

        const userDB = await User.findOne({email});
        let user;

        if(!userDB) {
            user = new User({
                name,
                email,
                image: picture,
                password: "None",
                google: true
            });
        }else {
            user = userDB;
            user.google = true;
        }

        await user.save();

        const token = await generateJsonWebToken(user._id);

        res.status(200).json({
            ok: true,
            message: "Login successful",
            token
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: "API error",
            err
        });
    }
}

async function renewToken(req, res = response) {

    const _id = req._id;

    const token = await generateJsonWebToken(_id);

    res.status(200).json({
        ok: true,
        message: "New Token generated",
        token
    });
}

module.exports = {
    loginUser,
    loginGoogleUser,
    renewToken
}