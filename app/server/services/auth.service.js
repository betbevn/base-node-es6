import jwt from "jsonwebtoken";
import models from "../models";
import { makeAuthSignature, verifyAuthSignature } from "../utils/crypto.util";

const UserRepository = models.User;

const login = async (req, res) => {
  const user = await UserRepository.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send({
      message: "User not found.",
    });
  }

  const privateKey = user.decryptPrivateKey(req.body.password);

  const [message, signature] = makeAuthSignature(privateKey);

  const secret = message + signature;

  if (verifyAuthSignature(req.body.publicKey, message, signature)) {
    const token = jwt.sign(user.toJSON(), secret, {
      expiresIn: "1h",
    });
    res.status(200).send({
      message: "User Logged In",
      data: {
        user,
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

  newUser.encryptPrivateKey(req.body.password);
  newUser.email = req.body.email;
  newUser.username = req.body.username;
  newUser.title = req.body.title;
  newUser.bio = req.body.bio;

  const user = await newUser.save();
  res.send({ data: user, message: "User was created!" });
};

const authController = { login, signup };

export default authController;
