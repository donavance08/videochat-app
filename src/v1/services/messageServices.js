const messageDB = require('../database/messageDB');

module.exports.addMessage = (id, message) => {
  messageDB.addMessage(id, message);
};

module.exports.getConversationHistory = (id) => {
  messageDB.getConversationHistory(id);
};
