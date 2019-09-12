const mongoose = require('mongoose');

module.exports = mongoose.model('Post', {
    title: String,
    image: String,
    body: String,
    createDate: {   type: Date,
                    default: Date.now }
});