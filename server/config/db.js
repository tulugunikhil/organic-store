const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("No MONGO_URI configured. Running in demo mode without MongoDB.");
      return false;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed. Continuing in demo mode:", error.message);
    return false;
  }
};

module.exports = connectDB;
