const { Schema, model } = require('mongoose');

const schema = new Schema({
    liveNumber: {
        type: Number,
        require: true
    },
    number: {
        type: Number,
        require: true
    },
    answers: {
        type: [],
        require: true
    },
    winners: {
        type: [],
        require: true
    },
    timezone: {
        type: String,
        require: true
    },
    isSentWinners: {
        type: Boolean,
        require: true
    }
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = model('Quest', schema);
