import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";

import swaggerUI from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };

import authRouter from "./routes/api/auth-router.js";
import dashboardRouter from "./routes/api/dashboards-router.js";
import columnRouter from "./routes/api/column-router.js";
import cardsRouter from "./routes/api/cards-router.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/column", columnRouter);
app.use("/api/cards", cardsRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
