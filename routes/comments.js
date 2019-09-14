const express = require('express');
const router = express.Router();
// const   passport = require('passport');
const   User = require('../associations/models/user');
        Post = require('../associations/models/post');

// Form for new post
router.get('/posts/:id/comments/new', (req, res) => {
    res.render('newComment.ejs');
})

/*
// Post new blog post
router.post('/posts', (req, res) => {
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.create(req.body.post, (error, newPost) => {
        if(error) {
            console.log('ERROR. Could not create post: ' + error);
        } else {
            res.redirect('/posts/'+newPost.id);
        }
    })
})
*/



module.exports = router;