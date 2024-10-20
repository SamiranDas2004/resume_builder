import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://samiran4209:Samiran123@cluster0.tqsso.mongodb.net/", {
     
    });
    console.log("MongoDB database connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); 
  }
};

export default connectDB;
