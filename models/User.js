const uidGenerator = require('node-unique-id-generator');

class User {
  constructor({
    login = '',
  }) {
    this.id = uidGenerator.generateUniqueId();
    this.login = login;
  }
}

module.exports = User;