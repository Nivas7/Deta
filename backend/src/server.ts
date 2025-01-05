import express, { Application } from "express";
import apiRouter from "./routes/api.js";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1", apiRouter);

app.listen(port, () => {
  console.log(`Deta Application Server listening on port ${port}`);
});

export default app;
