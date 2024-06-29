require("dotenv").config();
const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

dbConnection().catch(err => console.log(err));

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

app.listen(process.env.API_PORT, () => {
    console.log("Server running. Port: " + process.env.API_PORT);
});