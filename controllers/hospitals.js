const { response } = require("express");
const Hospital = require("../models/hospital");

async function getHospitals(req, res) {
    const hospitals = await Hospital.find()
        .populate("user", "name email role");

    res.status(200).json({
        ok: true,
        message: "All Hospitals",
        hospitals
    });
}

async function createHospital(req, res = response) {
    try {
        const _id = req._id;
        const hospital = new Hospital({user: _id, ...req.body});

        await hospital.save();

        res.status(200).json({
            ok: true,
            message: "Hospital created successful",
            hospital
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "API error"
        });
    }
}

async function updateHospital(req, res = response) {
    const _id = req.params.id;

    try {
        const hospitalDB = await Hospital.findById(_id);

        if(!hospitalDB){
            return res.status(404).json({
                ok: false,
                message: "Hospital doesn't exist"
            });
        }

        const hospitalUpdated = await Hospital.findByIdAndUpdate(_id, req.body, { new: true });

        res.status(200).json({
            ok: true,
            message: "Hospital updated successfully",
            hospital: hospitalUpdated
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "API error"
        });
    }
}

async function deleteHospital(req, res = response) {
    const _id = req.params.id;

    try {
        const hospitalDB = await Hospital.findById(_id);

        if(!hospitalDB){
            return res.status(404).json({
                ok: false,
                message: "Hospital doesn't exist"
            });
        }

        const hosopitalUpdated = await Hospital.findByIdAndDelete(_id);

        res.status(200).json({
            ok: true,
            message: "Hospital deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "API error"
        });
    }
}

module.exports = {
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
}