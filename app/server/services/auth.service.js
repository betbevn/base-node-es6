import jwt from "jsonwebtoken";
import models from "../models";

const UserRepository = models.User;

const login = async (req, res) => {
  const user = await UserRepository.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send({
      message: "User not found.",
    });
  } else if (user.validatePassword(req.body.password)) {
    const token = jwt.sign(user.toJSON(), "secretkeyappearshere", {
      expiresIn: "1h",
    });
    res.status(200).send({
      message: "User Logged In",
      data: {
        token,
      },
    });
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

  newUser.userName = req.body.userName;
  newUser.email = req.body.email;
  newUser.title = req.body.title;
  newUser.bio = req.body.bio;
  newUser.setPassword(req.body.password);

  const user = await newUser.save();
  res.send({ data: user, message: "" });
};

const authController = { login, signup };

export default authController;
