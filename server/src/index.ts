import express from "express";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import routers from "./routes/index.routes";
import { fileStorage, fileFilter } from "./middlewares/multer.middlewares";

import { config } from "./config";
import { genericErrorHandler } from "./middlewares/errorHandler.middlewares";

const app = express();

const limiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 10,
  message: "Too many requests",
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the actual origin of your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routers);
app.use(limiter);
app.use(genericErrorHandler);

app.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}`);
});
