import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import users from "../services/user.service";
const router = express.Router();

const UserController = (app) => {
  router.get("/", (req, res) => {
    users.findAll(req, res);
  });
  router.get("/:id", authenticateToken, (req, res) => {
    users.findOneById(req, res);
  });

  app.use("/api/users", router);
};

export default UserController;
