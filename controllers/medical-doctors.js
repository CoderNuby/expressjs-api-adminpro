const { response } = require("express");
const MedicalDoctor = require("../models/medical-doctor");
const Hospital = require("../models/hospital");

async function getMedicalDoctors(req, res) {
    
    const currentPage = Number(req.query.currentPage);
    const recordsPerPage = Number(req.query.recordsPerPage);

        const [ medicalDoctors, totalRecords ] = await Promise.all([
            MedicalDoctor.find()
            .populate("user", "name email role google image")
                .skip(currentPage * recordsPerPage)
                .limit(recordsPerPage),
                MedicalDoctor.countDocuments()
        ]);

    res.status(200).json({
        ok: true,
        message: "All Medical Doctors",
        medicalDoctors,
        totalRecords
    });
}

async function getMedicalDoctor(req, res) {

    try {
        const doctorId = req.params.id;

        const medicalDoctor = await MedicalDoctor.findById(doctorId)
            .populate("hospital")
            .populate("user", "name email role google image");
    
        if(!medicalDoctor) {
            return res.status(200).json({
                ok: true,
                message: "Doctor not found",
            });
        }
    
        res.status(200).json({
            ok: true,
            message: "Medical Doctor",
            medicalDoctor
        });
    } catch (err) {
        return res.status(500).json({
            ok: true,
            message: "API error"
        });
    }
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
            message: "Doctor created successful",
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
        }, {new: true});

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
    deleteMedicalDoctor,
    getMedicalDoctor
}