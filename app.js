const express = require('express');
const app = express();
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true, useFindAndModify: false });
const methodOverride = require('method-override');
const url = require('url');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended:true})); 
app.use(methodOverride('_method'));

const Post = require('./associations/models/post');
const Comment = require('./associations/models/comment');
const User = require('./associations/models/user');

// Info to all views
app.use((req, res, next) => {
    res.locals.currentView = req.url; // KOLLA OM NEW/LOGIN/REGISTER FINNS
    next();
});

app.get('/', (req, res) => {
    res.redirect('/posts');
})

app.get('/posts', (req, res) => {
   // setActiveTab(req);
    Post.find({}, (error, posts) => {
        if(error) {
            console.log('ERROR. Could not load content: ' + error);
        } else {
            res.render('index.ejs', {posts: posts});
        }
    })
})

// Form for new post
app.get('/posts/new', (req, res) => {
  //  setActiveTab(req);
    res.render('newPost.ejs');
})


// Post new blog post
app.post('/posts', (req, res) => {
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.create(req.body.post, (error, newPost) => {
        if(error) {
            console.log('ERROR. Could not create post: ' + error);
        } else {
            res.redirect('/posts/'+newPost.id);
        }
    })
})

// Show specific blog post
app.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id, (error, post) => {
        if(error) {
            // Fix blog not found
            res.redirect('/posts');
        } else {
            res.render('show', {post: post});
        }
    })
})

// Edit post
app.get('/posts/:id/edit', (req, res) => {
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
app.put('/posts/:id', (req, res) => {
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
app.delete('/posts/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id, (error, post) => {
        if (error) {
            res.redirect('/posts/'+req.params.id);  // TODO: kontrollera!
            console.log('ERROR: ' + error);
        } else {
            res.redirect('/');
        }
    })
})



// 404 / not found
app.get('*', (req, res) => {
    res.render('notFound');
})


app.listen(3000, () => {
    console.log('Blog is up!');
})

/*
function setActiveTab(req) {
    if(req.url.includes('new')) {
        console.log('yes!');
        document.getElementById('new-tab').classList.add('active');
    }
    console.log(req.url);
}
*/



