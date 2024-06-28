require("dotenv").config();
const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require('cors');

const app = express();
app.use(cors());

dbConnection().catch(err => console.log(err));

app.listen(process.env.API_PORT, () => {
    console.log("Server running. Port: " + process.env.API_PORT);
});