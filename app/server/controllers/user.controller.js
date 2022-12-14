import models from "../models";

const UserRepository = models.User;

const findAll = async (req, res) => {
  const users = await UserRepository.find();
  res.send(users);
};

const create = async (req, res) => {
  const newUserRepository = new UserRepository(req.body);
  const user = await newUserRepository.save();
  res.send(user);
};

const userController = { findAll, create };

export default userController;
