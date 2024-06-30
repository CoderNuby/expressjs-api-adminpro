const User = require("../models/user");
const Hospital = require("../models/hospital");
const MedicalDoctor = require("../models/medical-doctor");
const fs = require("fs");

async function updateImage(collection, _id, path, fileName) {

    let oldPath = "";
    switch (collection) {
        case "hospitals":
            const hospital = await Hospital.findById(_id);
            if(!hospital){
                if(fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }
                return {
                    ok: false,
                    message: "Hospital not found"
                }
            }

            oldPath = `./uploads/hospitals/${hospital.image}`;

            if(fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            hospital.image = fileName;
            await hospital.save();
            return {
                ok: true,
                message: "Hospital image uploaded successful"
            }

        case "medicalDoctors":
            const medicalDoctor = await MedicalDoctor.findById(_id);
            if(!medicalDoctor){
                if(fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }
                return {
                    ok: false,
                    message: "Doctor not found"
                }
            }

            oldPath = `./uploads/medicalDoctors/${medicalDoctor.image}`;

            if(fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            medicalDoctor.image = fileName;
            await medicalDoctor.save();
            return {
                ok: true,
                message: "Doctor image uploaded successful"
            }

        case "users":
            const user = await User.findById(_id);
            if(!user){
                if(fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }
                return {
                    ok: false,
                    message: "User not found"
                }
            }

            oldPath = `./uploads/users/${user.image}`;

            if(fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            user.image = fileName;
            await user.save();
            return {
                ok: true,
                message: "User image uploaded successful"
            }

        default:
            break;
    }
}


module.exports = {
    updateImage
}