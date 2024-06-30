const { response } = require("express");
const MedicalDoctor = require("../models/medical-doctor");

async function getMedicalDoctors(req, res) {

    const medicalDoctors = await MedicalDoctor.find()
        .populate("user", "name email role")
        .populate("hospital", "name");

    res.status(200).json({
        ok: true,
        message: "Hello world",
        medicalDoctors
    });
}

async function createMedicalDoctor(req, res = response) {

    try {
        const _id = req._id;
        const { hospitalId } = req.body;
        const medicalDoctor = new MedicalDoctor({user: _id, hospital: hospitalId, ...req.body});

        await medicalDoctor.save();

        res.status(200).json({
            ok: true,
            message: "Hospital created successful",
            medicalDoctor
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "API error"
        });
    }
}

async function updateMedicalDoctor(req, res = response) {

    res.status(200).json({
        ok: true,
        message: "Hello world"
    });
}

async function deleteMedicalDoctor(req, res = response) {

    res.status(200).json({
        ok: true,
        message: "Hello world"
    });
}

module.exports = {
    getMedicalDoctors,
    createMedicalDoctor,
    updateMedicalDoctor,
    deleteMedicalDoctor
}