import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { healthRouter } from "./routes/health.js";
import { vehiclesRouter } from "./routes/vehicles.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3000";

app.use(helmet());
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Tuncauto API",
    version: "0.1.0",
    docs: "/api/health",
  });
});

app.use("/api/health", healthRouter);
app.use("/api/vehicles", vehiclesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Tuncauto API running on http://localhost:${port}`);
});
