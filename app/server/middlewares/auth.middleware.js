import fs from "fs";
import jwt from "jsonwebtoken";
import { makeAuthSignature } from "../utils/crypto.util";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  const privateKeyPem = fs.readFileSync("../certs/key.pem", "utf8");

  const privateKey = getPrivateKeyFromPem(privateKeyPem);

  const [message, signature] = makeAuthSignature(privateKey);

  const secret = message + signature;

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
