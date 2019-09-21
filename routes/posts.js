const express = require('express');
const expressSanitizer = require('express-sanitizer');
const router = express.Router();
const   passport = require('passport');
const   User = require('../associations/models/user');
        Post = require('../associations/models/post');

router.get('/posts', (req, res) => {
    Post.find({}, (error, posts) => {
        if(error) {
            console.log('ERROR. Could not load content: ' + error);
        } else {
            res.render('index', {posts: posts});
        }
    })
})


// Form for new post
router.get('/posts/new', (req, res) => {
    res.render('newPost.ejs');
})

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

// Post new blog post #2 
/*
router.post('/posts', (req, res) => {
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.create({
        title: req.body.post.title,
        image: req.body.post.image,
        body: req.body.post.body,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, (error, newPost) => {
        if(error) {
            console.log('ERROR. Could not create post: ' + error);
        } else {
            res.redirect('/posts/'+newPost.id);
        }
    })
})
*/


// Show specific blog post
router.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id).populate('comments').exec((error, post) => {
        if(error) {
            // Fix blog not found
            res.redirect('/posts');
        } else {
            console.log(post);
            res.render('show', {post: post});
        }
    })
})

// Edit post
router.get('/posts/:id/edit', (req, res) => {
    Post.findById(req.params.id, (error, post) => {
        if(error) {
            // Fix blog not found
            res.redirect('/posts');
        } else {
            res.render('edit', {post: post});
        }
    })
})

// Update post
router.put('/posts/:id', (req, res) => {
    req.body.post.body = req.sanitize(req.body.post.body);  // Sanitize to remove scripts from body :)
    Post.findByIdAndUpdate(req.params.id, req.body.post, (error, post) => {
        if (error) {
            res.redirect('/posts/'+req.params.id);  // TODO: kontrollera!
            console.log('ERROR: ' + error);
        } else {
            res.redirect('/posts/'+req.params.id);
        }
    })
})

// Delete post
router.delete('/posts/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id, (error, post) => {
        if (error) {
            res.redirect('/posts/'+req.params.id);  // TODO: kontrollera!
            console.log('ERROR: ' + error);
        } else {
            res.redirect('/');
        }
    })
})



module.exports = router;