const mongoose = require('mongoose');

module.exports = mongoose.model('Comment', {
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,       // type: ID from mongo
            ref: 'User'
        },
        username: String
    }
});