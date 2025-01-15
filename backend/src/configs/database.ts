import mongoose from "mongoose";

async function database(): Promise<void> {
  try {
    console.log(process.env.MONGODB_URI);
    const mongoUri = process.env.MONGODB_URI as string;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined");
    }
    await mongoose.connect(mongoUri);
    console.log("Database Connected ");
  } catch (error: any) {
    console.error(`Database Connection Failed => ${error}`);
  }
}

export default database;
