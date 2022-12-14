import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
