import express from "express";
import dotenv from "dotenv";
import database from "./configs/database.js";
import routes from "./routes/route.js";

dotenv.config();

const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
  routes(app);
  database();
  console.log(`Deta Application Server listening on port ${process.env.PORT}`);
});
