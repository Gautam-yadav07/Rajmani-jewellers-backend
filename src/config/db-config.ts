import mongoose from "mongoose"
import { config } from "dotenv"
config()

const uri: string = process.env.MONGO_URI || "mongodb://localhost:27017/tijori"

export const connectDB = () => {
    
  mongoose
    .connect(uri)
    .then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    });
};