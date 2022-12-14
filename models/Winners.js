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
    timeAnswer: {
        type: String,
        require: true
    },
    numberAns: {
        type: String,
        require: true
    },
    numberLive: {
        type: String,
        require: true
    },
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = model('Winner', schema);
