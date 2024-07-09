const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJsonWebToken } = require("../helpers/jsonwebtoken");

async function getUsers(req, res) {

    const _id = req._id;

    const currentPage = Number(req.query.currentPage);
    const recordsPerPage = Number(req.query.recordsPerPage);

    const [ users, totalRecords ] = await Promise.all([
        User.find({
            $and: [
                {_id: { $ne: _id }},
                {role: { $ne: "ADMIN_ROLE" }}
            ]}, "name email role google image")
            .skip(currentPage * recordsPerPage)
            .limit(recordsPerPage),
        User.countDocuments({
            $and: [
                {_id: { $ne: _id }},
                {role: { $ne: "ADMIN_ROLE" }}
            ]})
    ]);

    res.status(200).json({
        ok: true,
        message: "All Users",
        users,
        totalRecords
    });
}

async function getAdmins(req, res = response) {
    const _id = req._id;

    const currentPage = Number(req.query.currentPage);
    const recordsPerPage = Number(req.query.recordsPerPage);

    const [ users, totalRecords ] = await Promise.all([
        await User.find({role: "ADMIN_ROLE"},
            "name email role google image")
            .skip(currentPage * recordsPerPage)
            .limit(recordsPerPage),
        User.countDocuments({role: "ADMIN_ROLE"})
    ]);

    res.status(200).json({
        ok: true,
        message: "All Admins Users",
        users,
        totalRecords
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

        const token = await generateJsonWebToken(user._id);

        res.status(200).json({
            ok: true,
            message: "User created successful",
            user,
            token
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

        const { password, google, image, role, email, ...fields } = req.body;
        if (userDB.email !== email) {
            const emailExist = await User.findOne({email});
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

async function deleteUser(req, res = response) {
    const _id = req.params.id;

    try {
        const userDB = await User.findById(_id);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: "User doesn't exist"
            });
        }

        await User.findByIdAndDelete(_id);

        res.status(200).json({
            ok: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: "API error"
        });
    }
}

async function changeToAdminRole(req, res = response) {
    const _id = req.params.id;

    try {
        const userDB = await User.findById(_id);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: "User doesn't exist"
            });
        }

        const userUpdated = await User.findByIdAndUpdate(_id, { role: "ADMIN_ROLE" }, { new: true });

        res.status(200).json({
            ok: true,
            message: "role updated successful",
            user: userUpdated
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: "API error"
        });
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    changeToAdminRole,
    getAdmins
}