import express, { Application, Request, Response } from "express";
import apiRouter from "./routes/api.js";
import { MONGODB_URI } from "./utils/secrets.js";
import mongoose from "mongoose";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const mongo = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

app.use("/api/v1", apiRouter);
app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

mongo();

app.listen(port, () => {
  console.log(`Deta Application Server listening on port ${port}`);
});





export default app;
