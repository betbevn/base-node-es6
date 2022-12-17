import models from "../models";

const UserRepository = models.User;

const findAll = async (req, res) => {
  const users = await UserRepository.find();
  res.send(users);
};
const findOneById = async (req, res) => {
  const users = await UserRepository.findById(req.params.id);
  res.send(users);
};

const userController = { findAll, findOneById };

export default userController;
