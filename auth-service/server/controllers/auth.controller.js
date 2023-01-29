import express from "express";
import passport from "passport";
// import auth from "../services/auth.service";
const router = express.Router();

const AuthController = (app) => {
  router.get("/", (req, res) => {
    res.send("Weclome to Single Sign-On on Auth Service");
  });

  router.get(
    "/login",
    (req, res, next) => {
      //login handler starts
      next();
    },
    passport.authenticate("samlStrategy")
  );

  router.post(
    "/login/callback",
    (req, res, next) => {
      //login callback starts
      next();
    },
    passport.authenticate("samlStrategy"),
    (req, res) => {
      //SSO response payload
      res.send(req.user.attributes);
    }
  );

  // router.post("/login", (req, res) => {
  //   auth.login(req, res);
  // });
  // router.post("/signup", (req, res) => {
  //   auth.signup(req, res);
  // });
  // router.post("/logout", (req, res) => {
  //   auth.logout(req, res);
  // });

  app.use("/api/auth", router);
};

export default AuthController;
