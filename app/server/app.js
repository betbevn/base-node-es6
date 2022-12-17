import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import * as dotenv from "dotenv";
import routes from "./controllers";
import { connectDB } from "./models";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

routes.auth(app);
routes.users(app);

connectDB()
  .then(() => {
    console.log("Connected to the database!");
    const PORT = process.env.NODE_DOCKER_PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

export default app;
