const uidGenerator = require('node-unique-id-generator');

class User {
  constructor({
    mail = '',
  }) {
    this.id = uidGenerator.generateUniqueId();
    this.mail = mail;
  }
}

module.exports = User;