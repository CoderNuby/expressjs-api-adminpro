const { Schema, model } = require("mongoose");

const MedicalDoctorSchema = Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    hospital: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "Hospital"
    }
});

module.exports = model("MedicalDoctor", MedicalDoctorSchema);