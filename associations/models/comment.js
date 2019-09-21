const mongoose = require('mongoose');

module.exports = mongoose.model('Comment', {
    text: String,
    createDate: {   type: Date,
        default: Date.now },
    author: String
});
