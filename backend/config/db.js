import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // We add 'family: 4' to force IPv4, which fixes many network refusal errors
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
