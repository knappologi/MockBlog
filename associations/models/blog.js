const mongoose = require('mongoose');

module.exports = mongoose.model('Blog', {
    title: String,
    image: String,
    body: String,
    createDate: {   type: Date,
                    default: Date.now }
});