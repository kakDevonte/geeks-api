const { Schema, model } = require('mongoose');

const schema = new Schema({
    timezone: {
        type: String,
        require: true
    },
    openApp: {
        type: Number,
        require: true
    },
    uniqueWinners: {
        type: Number,
        require: true
    },
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = model('Stats', schema);
