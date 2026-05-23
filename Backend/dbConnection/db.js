const mongoose = require("mongoose");

async function DbConnection() {
  const MONGO_URL = process.env.MONGO_URL;

  try {
    (await mongoose.connect(MONGO_URL), console.log("DB Connected"));
  } catch (error) {
    console.error("Connection Error", error.message);
  }
}

module.exports = DbConnection;
