import express from "express";
import passport from "passport";
import { isAuthenticated } from "../middlewares/auth.middleware";
// import baby from "../services/baby.service";
const router = express.Router();

const AuthController = (app) => {
  router.get("/", (req, res) => {
    res.send("Weclome to Single Sign-On on Baby Service");
  });

  router.get(
    "/login",
    (req, res, next) => {
      //login handler starts
      next();
    },
    passport.authenticate("samlStrategy")
  );

  router.get(
    "/order-list",
    (req, res, next) => {
      //login handler starts
      next();
    },
    isAuthenticated,
    (req, res) => {
      const babies = ["LyLy", "Luna", "Sia"];
      res.send(babies);
    }
  );

  router.post(
    "/callback",
    (req, res, next) => {
      //login handler starts
      next();
    },
    passport.authenticate("samlStrategy"),
    (req, res) => {
      //SSO response payload
      res.send(req.user.attributes);
    }
  );

  app.use("/api/baby", router);
};

export default AuthController;
