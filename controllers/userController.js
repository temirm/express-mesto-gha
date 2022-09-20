const MongooseError = require('mongoose').Error;
const User = require('../models/userModel');
const { UserAPIModel } = require('../utils/APIModels');
const { BadRequestError, NotFoundError } = require('../utils/errors');

async function getUsers(req, res, next) {
  try {
    const users = await User.find({});

    res.send(users.map((user) => new UserAPIModel(user)));
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) throw new NotFoundError(`Пользователь по указанному id ${userId} не найден`);

    res.send(new UserAPIModel(user));
  } catch (err) {
    if (err instanceof MongooseError.CastError) next(new BadRequestError(`Некорректный формат id ${userId} пользователя`));
    else next(err);
  }
}

async function createUser(req, res, next) {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });

    res.status(201).send(new UserAPIModel(user));
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    else next(err);
  }
}

async function updateUser(req, res, next) {
  const { name, about } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) throw new NotFoundError(`Пользователь с указанным id ${userId} не найден`);

    res.send(new UserAPIModel(user));
  } catch (err) {
    if (err instanceof MongooseError.CastError) next(new NotFoundError(`Пользователь с указанным id ${userId} не найден`));
    else if (err instanceof MongooseError.ValidationError) next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    else next(err);
  }
}

async function updateUserAvatar(req, res, next) {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) throw new NotFoundError(`Пользователь с указанным id ${userId} не найден`);

    res.send(new UserAPIModel(user));
  } catch (err) {
    if (err instanceof MongooseError.CastError) next(new NotFoundError(`Пользователь с указанным id ${userId} не найден`));
    else if (err instanceof MongooseError.ValidationError) next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    else next(err);
  }
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateUserAvatar,
};
