const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

async function getUsers(req, res) {

    const users = await User.find({}, "name email role google password");

    res.status(200).json({
        ok: true,
        message: "All Users",
        users
    });
}

async function createUser(req, res = response) {
    const { email, password, name } = req.body;

    try {
        const userDB = await User.findOne({email});

        if(userDB){
            return res.status(400).json({
                ok: false,
                message: "Email already exist"
            });
        }

        const user = new User(req.body);

        const salt = bcryptjs.genSaltSync();

        user.password = bcryptjs.hashSync(password, salt);

        await user.save();

        res.status(200).json({
            ok: true,
            message: "User created successful",
            user
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "API error"
        });
    }
}

async function updateUser(req, res = response) {
    const _id = req.params.id;

    try {
        const userDB = await User.findById(_id);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: "User doesn't exist"
            });
        }

        const { password, google, email, ...fields } = req.body;
        if (userDB.email !== fields.email) {
            const emailExist = await User.findOne({email});
            console.log(emailExist);
            if(emailExist) {
                return res.status(400).json({
                    ok: false,
                    message: "This email already exist"
                });
            }
        }

        fields.email = email;

        const userUpdated = await User.findByIdAndUpdate(_id, fields, { new: true });

        res.status(200).json({
            ok: true,
            message: "User updated successfully",
            user: userUpdated
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "API error"
        });
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser
}