import { generateToken } from "../utils/config";
import models from "../models";

const UserRepository = models.User;

const login = async (req, res) => {
  const user = await UserRepository.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send({
      message: "User not found.",
    });
  } else if (user.validatePassword(req.body.password)) {
    const token = generateToken(user);
    res.cookie("access_token", token, {
      maxAge: 1 * 60 * 60 * 1000, // milliseconds
      httpOnly: true,
      // secure: true;
    });
    res.status(200).json({ message: "Logged in successfully!", data: user });
  } else {
    res.status(400).send({
      message: "Invalid Email or Password!",
    });
  }
};

const signup = async (req, res) => {
  const isUserExisted = await UserRepository.findOne({ email: req.body.email });
  if (isUserExisted) {
    res.send({ data: "", message: "User existed!" });
    return;
  }

  const newUser = new UserRepository();

  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.title = req.body.title;
  newUser.bio = req.body.bio;
  newUser.setPassword(req.body.password);

  const user = await newUser.save();
  const token = generateToken(user);
  res.cookie("access_token", token, {
    maxAge: 1 * 60 * 60 * 1000, // milliseconds
    httpOnly: true,
    // secure: true;
  });
  res.send({ data: user, message: "User signup successfully!" });
};

const logout = (req, res) => {
  const { cookies } = req;

  const jwt = cookies.access_token;

  if (!jwt) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

  res
    .status(200)
    .clearCookie("access_token", {
      httpOnly: true,
      path: "/",
    })
    .send({
      status: "ok",
      error: "Logged out!",
    });
};

const authController = { login, signup, logout };

export default authController;
