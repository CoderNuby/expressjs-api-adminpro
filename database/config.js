const mongoose = require('mongoose');

async function dbConnection() {
  await mongoose.connect(process.env.MONGODB_STRING_CONNECTION)
    .then(console.log("Database connection working"));
}

module.exports = {
  dbConnection
}