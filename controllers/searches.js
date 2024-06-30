const { response } = require("express");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const MedicalDoctor = require("../models/medical-doctor");



async function searchFromAll(req, res = response) {

    const keyword = req.params.keyword;

    const regExp = new RegExp(keyword, "i");

    const [ users, hospital, medicalDoctor] = await Promise.all([
        User.find({
            $or: [
                { name: regExp },
                { email: regExp }
            ]}),
        Hospital.find({name: regExp}),
        MedicalDoctor.find({name: regExp})
    ]);

    res.status(200).json({
        ok: true,
        message: "Get from all collections",
        users,
        hospital,
        medicalDoctor
    });
}

async function searchFromCollection(req, res = response){
    const collection = req.params.collection;
    const keyword = req.params.keyword;

    const regExp = new RegExp(keyword, "i");

    let data = null;

    switch (collection) {
        case "users":
            data = await User.find({
                $or: [
                    { name: regExp },
                    { email: regExp }
                ]}, "name email role");
            break;

        case "hospitals":
            data = await Hospital.find({name: regExp})
                .populate("user", "name email role");
            break;

        case "medicalDoctors":
            data = await MedicalDoctor.find({name: regExp})
            .populate("user", "name email role")
            .populate("hospital");
            break;

        default:      
            return res.status(404).json({
                ok: true,
                message: `Collection ${collection} not found`
            });
    }

    return res.status(200).json({
        ok: true,
        message: `Get from ${collection} collection`,
        data
    });
}

module.exports = {
    searchFromAll,
    searchFromCollection
}