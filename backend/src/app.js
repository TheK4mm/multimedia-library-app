const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const requestLogger = require("./middleware/requestLogger");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const apiRouter = require("./routes");

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.corsOrigins.includes("*") || env.corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Origen no permitido por CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.get("/", (_req, res) =>
  res.json({
    name: "Multimedia Library API",
    version: "2.0.0",
    docs: "/api/health",
  })
);

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
