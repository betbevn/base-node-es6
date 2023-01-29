import jwt from "jsonwebtoken";
import models from "../models";
import {
  makeAuthSignature,
  verifyAuthSignature,
  getPublicKeyFromPem,
  getPrivateKeyFromPem,
  recoveryRawPasswordFromEncryptedPassword,
} from "../utils/crypto.util";
import fs from "fs";

const UserRepository = models.User;

const login = async (req, res) => {
  const user = await UserRepository.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send({
      message: "User not found.",
    });
  }

  if (!req.body.publicKey) {
    res.status(400).send({
      message: "Invalid public key",
    });
  }

  if (!req.body.encryptedPassword) {
    res.status(400).send({
      message: "Invalid encrypted password",
    });
  }

  // Get privateKeyPem from local server
  const privateKeyPem = fs.readFileSync(
    require.resolve("../certs/key.pem"),
    "utf8"
  );

  // Get privateKey from privateKeyPem
  const privateKeyFromServer = getPrivateKeyFromPem(privateKeyPem);

  // Recovery raw password from encrypted password
  const password = recoveryRawPasswordFromEncryptedPassword(
    privateKeyFromServer,
    req.body.encryptedPassword
  );

  const privateKey = user.recoveryPrivateKey(password);

  if (!privateKey) {
    res.status(400).send({
      message: "Invalid private key",
    });
  }

  const [message, signature] = makeAuthSignature(privateKey);

  const publicKey = getPublicKeyFromPem(req.body.publicKey);

  if (verifyAuthSignature(publicKey, message, signature)) {
    const token = jwt.sign(user.toJSON(), signature, {
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

  if (!req.body.encryptedPassword) {
    res.status(400).send({
      message: "Invalid encrypted password",
    });
  }

  // Get privateKeyPem from local server
  const privateKeyPem = fs.readFileSync(
    require.resolve("../certs/key.pem"),
    "utf8"
  );

  // Get privateKey from privateKeyPem
  const privateKey = getPrivateKeyFromPem(privateKeyPem);

  // Recovery raw password from encrypted password
  const password = recoveryRawPasswordFromEncryptedPassword(
    privateKey,
    req.body.encryptedPassword
  );

  const newUser = new UserRepository();

  newUser.encodingPrivateKey(password);
  newUser.email = req.body.email;
  newUser.username = req.body.username;
  newUser.title = req.body.title;
  newUser.bio = req.body.bio;

  const user = await newUser.save();
  res.send({ data: user, message: "User was created!" });
};

const authController = { login, signup };

export default authController;
