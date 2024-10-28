const mongoose = require("mongoose");
const { urlDb } = require("../config");

mongoose
  .connect(urlDb)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));


module.exports = mongoose