const Card = require('../models/cardModel');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({
      data: cards,
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({
      data: card,
    }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({
      data: card,
    }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
