import fs from "fs";
import jwt from "jsonwebtoken";
import { makeAuthSignature, getPrivateKeyFromPem } from "../utils/crypto.util";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  const privateKeyPem = fs.readFileSync(
    require.resolve("../certs/key.pem"),
    "utf8"
  );

  const privateKey = getPrivateKeyFromPem(privateKeyPem);

  const [_, signature] = makeAuthSignature(privateKey);

  jwt.verify(token, signature, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
