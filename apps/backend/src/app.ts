import express from "express";
import cookieParser from "cookie-parser";
import petsRouter from "./routes/pets.js";
import authRouter from "./routes/auth.js";
import eventRouter from "./routes/events.js";

import cors from "cors";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://fulfilling-transformation-production.up.railway.app",
    credentials: true,
  })
);
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/pets", eventRouter);

app.use("/api/pets", petsRouter);

app.use("/api/auth", authRouter);
export default app;