const { NotFoundError } = require('./errors');

const notFoundHandler = (req, res, next) => next(new NotFoundError('Ресурса по такому адресу не существует'));

module.exports = notFoundHandler;
