const { response } = require("express");
const Hospital = require("../models/hospital");

async function getHospitals(req, res) {

    
    const currentPage = Number(req.query.currentPage);
    const recordsPerPage = Number(req.query.recordsPerPage);

    const [ hospitals, totalRecords ] = await Promise.all([
        Hospital.find({}, "name image")
        .populate("user", "name email role google image")
            .skip(currentPage * recordsPerPage)
            .limit(recordsPerPage),
            Hospital.countDocuments()
    ]);

    res.status(200).json({
        ok: true,
        message: "All Hospitals",
        hospitals,
        totalRecords
    });
}

async function getHospital(req, res) {
    try {
        const id = req.params.id;

        const hospital = await Hospital.findById(id)
            .populate("user", "name email role google image");
    
        if(!hospital) {
            return res.status(404).json({
                ok: true,
                message: "Hospital not found"
            });
        }
    
        res.status(200).json({
            ok: true,
            message: "Get Hospital",
            hospital
        });
    } catch (err) {
        return res.status(500).json({
            ok: true,
            message: "API error"
        });
    }
}

async function getAllHospitalNames(req, res) {
    try {
        const hospitals = await Hospital.find({}, "name");

        if(!hospitals) {
            return res.status(404).json({
                ok: true,
                message: "No hospitals"
            });
        }
    
        res.status(200).json({
            ok: true,
            message: "Get Hospital",
            hospitals
        });
    } catch (err) {
        return res.status(500).json({
            ok: true,
            message: "API error"
        });
    }
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
    const hospitalId = req.params.id;
    const userId = req._id;

    try {
        const hospitalDB = await Hospital.findById(hospitalId);

        if(!hospitalDB){
            return res.status(404).json({
                ok: false,
                message: "Hospital doesn't exist"
            });
        }

        const hospitalUpdated = await Hospital.findByIdAndUpdate(hospitalId, {
            ...req.body,
            user: userId
        }, { new: true });

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

        await Hospital.findByIdAndDelete(_id);

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
    getAllHospitalNames,
    createHospital,
    updateHospital,
    deleteHospital,
    getHospital
}