const mongoose = require('mongoose');

module.exports = mongoose.model('Post', {
    title: String,
    image: String,
    body: String,
    createDate: {   type: Date,
                    default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});