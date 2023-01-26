import { generateToken } from "../utils/config";

const hello = async (req, res) => {
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

const authController = { login };

export default authController;
