import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import linksRouter from "./routes/links";
import redirectRouter from "./routes/redirect";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://tiny-link-bjp8.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.options("*", cors());
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

app.use("/api/links", linksRouter);
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime_seconds: process.uptime(),
    env: process.env.NODE_ENV || "development",
  });
});

// Redirect must be after /api
app.use("/", redirectRouter);

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
