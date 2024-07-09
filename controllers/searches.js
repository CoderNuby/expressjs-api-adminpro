const { response } = require("express");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const MedicalDoctor = require("../models/medical-doctor");



async function searchFromAll(req, res = response) {

    const keyword = req.params.keyword;

    const regExp = new RegExp(keyword, "i");

    const [ users, hospitals, medicalDoctors] = await Promise.all([
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
        hospitals,
        medicalDoctors
    });
}

async function searchFromCollection(req, res = response){
    const collection = req.params.collection;
    const keyword = req.params.keyword;
    const _id = req._id;

    const currentPage = Number(req.query.currentPage);
    const recordsPerPage = Number(req.query.recordsPerPage);

    const regExp = new RegExp(keyword, "i");

    let data = null;
    let totalRecords = 0;

    try {
        
        switch (collection) {
            case "users":
                [ data, totalRecords ] = await Promise.all([
                    User.find({
                        $or: [
                            { name: regExp },
                            { email: regExp }
                        ],
                        $and: [
                            {_id: { $ne: _id }},
                            {role: { $ne: "ADMIN_ROLE" }}
                        ]}, "name email role google image")
                        .skip(currentPage * recordsPerPage)
                        .limit(recordsPerPage),
                    User.find({
                        $or: [
                            { name: regExp },
                            { email: regExp }
                        ],
                        $and: [
                            {_id: { $ne: _id }},
                            {role: { $ne: "ADMIN_ROLE" }}
                        ]}).countDocuments()
                ]);
                break;

            case "hospitals":
                [ data, totalRecords ] = await Promise.all([
                    Hospital.find({name: regExp}, "name image")
                        .populate("user", "name email role")
                        .skip(currentPage * recordsPerPage)
                        .limit(recordsPerPage),
                    Hospital.find({name: regExp}).countDocuments()
                ]);
                break;

            case "medicalDoctors":
                [ data, totalRecords ] = await Promise.all([
                    MedicalDoctor.find({name: regExp})
                        .populate("user", "name email role")
                        .populate("hospital")
                        .skip(currentPage * recordsPerPage)
                        .limit(recordsPerPage),
                    MedicalDoctor.find({name: regExp}).countDocuments()
                ]);
                break;

            default:      
                return res.status(404).json({
                    ok: true,
                    message: `Collection ${collection} not found`
                });
        }

        if(!data) {
            return res.status(404).json({
                ok: true,
                message: "Data not found"
            });
        }

        res.status(200).json({
            ok: true,
            message: `Get from ${collection} collection`,
            data,
            totalRecords
        });
    } catch (err) {
        return res.status(500).json({
            ok: true,
            message: "API error"
        });
    }
}

module.exports = {
    searchFromAll,
    searchFromCollection
}