import express from "express";
import auth from "../services/auth.service";
const router = express.Router();

const AuthController = (app) => {
  router.post("/login", (req, res) => {
    auth.login(req, res);
  });
  router.post("/signup", (req, res) => {
    auth.signup(req, res);
  });
  router.post("/logout", (req, res) => {
    auth.logout(req, res);
  });

  app.use("/api/auth", router);
};

export default AuthController;
