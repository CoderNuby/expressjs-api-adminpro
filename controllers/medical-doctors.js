const { response } = require("express");
const MedicalDoctor = require("../models/medical-doctor");
const Hospital = require("../models/hospital");

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

        const hospital = await Hospital.findById(hospitalId);

        if(!hospital) {
            return res.status(404).json({
                ok: false,
                message: "Hospital not found"
            });
        }

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

    const doctorId = req.params.id;
    const userId = req._id;

    try {

        const medicalDoctor = await MedicalDoctor.findById(doctorId);

        if(!medicalDoctor) {
            return res.status(404).json({
                ok: true,
                message: "Doctor doesn't exist"
            });
        }

        const medicalDoctorUpdated = await MedicalDoctor.findByIdAndUpdate(doctorId, {
            user: userId,
            ...req.body
        });

        res.status(200).json({
            ok: true,
            message: "Doctor updated successful",
            medicalDoctor: medicalDoctorUpdated
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: true,
            message: "API error"
        });
    }

}

async function deleteMedicalDoctor(req, res = response) {

    const _id = req.params.id;

    try {
        const medicalDoctor = await MedicalDoctor.findById(_id);

        if(!medicalDoctor) {
            return res.status(404).json({
                ok: true,
                message: "Doctor doesn't exist"
            });
        }

        await MedicalDoctor.findByIdAndDelete(_id);

        res.status(200).json({
            ok: true,
            message: "Doctor deleted successful"
        });
    } catch (err) {
        return res.status(500).json({
            ok: true,
            message: "API error"
        });   
    }
}

module.exports = {
    getMedicalDoctors,
    createMedicalDoctor,
    updateMedicalDoctor,
    deleteMedicalDoctor
}