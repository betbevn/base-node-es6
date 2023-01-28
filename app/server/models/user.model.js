import fs from "fs";
import mongoose from "mongoose";
import {
  decryptPrivateKey,
  encryptPrivateKey,
  getPrivateKeyFromPem,
} from "../utils/crypto.util";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
    },
    bio: {
      type: String,
    },
    encryptedPrivateKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.methods.encryptPrivateKey = function (password) {
  const privateKeyPem = fs.readFileSync(
    require.resolve("../certs/key.pem"),
    "utf8"
  );

  const privateKey = getPrivateKeyFromPem(privateKeyPem);

  this.encryptedPrivateKey = encryptPrivateKey(privateKey, password);
};

UserSchema.methods.recoveryPrivateKey = function (password) {
  const privateKey = decryptPrivateKey(this.encryptedPrivateKey, password);
  return privateKey;
};

const User = mongoose.model("User", UserSchema);

export default User;
