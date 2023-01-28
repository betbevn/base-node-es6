import mongoose from "mongoose";
import { encryptPrivateKey } from "../utils/crypto.util";

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
  this.encryptedPrivateKey = encryptPrivateKey("", password);
};

UserSchema.methods.decryptPrivateKey = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

const User = mongoose.model("User", UserSchema);

export default User;
