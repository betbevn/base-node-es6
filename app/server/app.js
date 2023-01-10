import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import * as dotenv from "dotenv";
import routes from "./controllers";
import cors from "cors";
import { connectDB } from "./models";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5500", "http://localhost:8181"],
    credentials: true, // Enable cookie HTTP via CORS
  })
);

routes.auth(app);
routes.users(app);

connectDB()
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

export default app;
