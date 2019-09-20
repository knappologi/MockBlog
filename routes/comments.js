const express = require('express');
const router = express.Router();
// const   passport = require('passport');
const   User = require('../associations/models/user');
        Comment = require('../associations/models/post');
        Post = require('../associations/models/post');

// Form for new post
router.get('/posts/:id/comments/new', (req, res) => {
    res.render('newComment.ejs');
})


// Post new comment
router.post('/posts/:id/comments', (req, res) => {
    Post.findById(req.params.id, (error, post) => {
        if (error) {
            console.log("ERROR finding post: " + error)
            res.redirect('/');
        } else {
            req.body.comment.text = req.sanitize(req.body.comment.text);
            Comment.create(req.body.comment, (error, newPost) => {
                if(error) {
                    console.log('ERROR. Could not save comment: ' + error);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    res.redirect('/posts/'+newPost.id);
                }
            })
        }
    })
})




module.exports = router;