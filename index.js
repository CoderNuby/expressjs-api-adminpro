require("dotenv").config();
const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

dbConnection().catch(err => console.log(err));

app.use("/api/users", require("./routes/users"));
app.use("/api/hospitals", require("./routes/hospitals"));
app.use("/api/medicalDoctors", require("./routes/medical-doctor"));
app.use("/api/searches", require("./routes/search"));
app.use("/api/uploads", require("./routes/upload"));
app.use("/api/images", require("./routes/images"));
app.use("/api/auths", require("./routes/auth"));

app.listen(process.env.API_PORT, () => {
    console.log("Server running. Port: " + process.env.API_PORT);
});