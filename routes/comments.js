const express = require('express');
const router = express.Router();
// const   passport = require('passport');
const   User = require('../associations/models/user');
        Comment = require('../associations/models/comment');
        Post = require('../associations/models/post');

// Form for new post
router.get('/posts/:id/comments/new', (req, res) => {
    Post.findById(req.params.id, (error, post) => {
        if (error) {
            console.log("ERROR: " + error)
        } else {
          res.render('newComment.ejs', {post: post});
        }
      })
})


// Post new comment
router.post('/posts/:id/comments', (req, res) => {
    Post.findById(req.params.id, (error, post) => {
        if (error) {
            console.log("ERROR finding post: " + error)
            res.redirect('/');
        } else {
            Comment.create(req.body.comment, (error, newComment) => {
                if(error) {
                    console.log('ERROR. Could not create comment: ' + error);
                } else {
                    // newComment.author.id = req.user._id;
                    newComment.author = req.body.comment.author.trim();
                    newComment.text = req.sanitize(req.body.comment.text);
                    newComment.save();
                    post.comments.push(newComment);
                    post.save();
                    res.redirect('/posts/'+post._id);
                }
            })
        }
    })
})




module.exports = router;