import express from "express";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import { config } from "./config";

const app = express();

const limiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 10,
  message: "Too many requests",
});

app.use(express.json());
app.use(helmet());
app.use(limiter);

app.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}`);
});
