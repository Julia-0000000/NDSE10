const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  mail: {
    type: String,
    required: true,
  },
});

module.exports = model('User', userSchema);