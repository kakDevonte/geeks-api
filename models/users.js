const { Schema, model } = require('mongoose');

const schema = new Schema({
  id: {
    type: Number,
    require: true
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  timezone: {
    type: String,
    require: true
  },
  responseTime: {
    type: String,
    require: false
  }
});

schema.set('toJSON', {
  virtuals: true
});

module.exports = model('users', schema);
