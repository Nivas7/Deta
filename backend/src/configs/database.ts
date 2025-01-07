import mongoose from "mongoose";

async function database(): Promise<void> {
  try {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected ");
  } catch (error: any) {
    console.error(`Database Connection Failed => ${error}`);
  }
}

export default database;
