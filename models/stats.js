const { Schema, model } = require('mongoose');

const schema = new Schema({
    openApp: {
        type: Number,
        require: true
    },
    winners: {
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

module.exports = model('stats', schema);
