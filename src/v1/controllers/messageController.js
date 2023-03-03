const { validationResult } = require('express-validator');
const auth = require('../../../auth');
const messageServices = require('../services/messageServices');

module.exports.addMessage = (req, res) => {
  const errors = validationResult(req);
  const { body } = req;

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  messageServices.addMessage(body.id, body.message);
};

module.exports.getConversationHistory = (req, res) => {
  // const id = auth.decode(req.headers.id).id;

  messageServices.getConversationHistory();
};
