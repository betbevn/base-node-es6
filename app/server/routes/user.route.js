import express from "express";
import users from "../controllers/user.controller";
const router = express.Router();

const UserRoute = (app) => {
  router.post("/", users.create);
  router.get("/", users.findAll);

  app.use("/api/users", router);
};

export default UserRoute;
