import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import offersRoutes from "./routes/offers.routes.js";
import matchesRoutes from "./routes/matches.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

const clientOrigin = process.env.CLIENT_URL || true;

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/offers", offersRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/messages", messagesRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
