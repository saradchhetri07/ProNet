import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

export const config = {
  PORT: process.env.PORT,
  database: {
    client: process.env.DB_CLIENT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
};
