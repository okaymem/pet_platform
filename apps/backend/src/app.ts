import express from "express";
import cookieParser from "cookie-parser";
import petsRouter from "./routes/pets.js";
import authRouter from "./routes/auth.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/pets", petsRouter);

app.use("/auth", authRouter);
export default app;