const UserDB = require('./UserDB');

module.exports.addMessage = (id, message) => {
  console.log('id', id);
  console.log('message', message);
};

module.exports.getConversationHistory = (userId, contactId) => {
  const user = UserDB.findOne({ _id: userId });
};
