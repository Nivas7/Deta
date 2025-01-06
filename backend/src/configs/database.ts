import mongoose from "mongoose";
import { MONGODB_URI } from "../utils/secrets.js";

async function database(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database Connected ");
  } catch (error: any) {
    console.error("Database COnnection Failed");
  }
}

export default database;
