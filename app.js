const express = require('express');
const app = express();
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true, useFindAndModify: false });
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended:true})); 
app.use(methodOverride('_method'));

const Blog = require('./associations/models/blog');
const Post = require('./associations/models/post');
const Comment = require('./associations/models/comment');
const User = require('./associations/models/user');

app.get('/', (req, res) => {
    res.redirect('/blogs');
})

app.get('/blogs', (req, res) => {
    Blog.find({}, (error, blogs) => {
        if(error) {
            console.log('ERROR. Could not load content: ' + error);
        } else {
            res.render('index.ejs', {blogs: blogs});
        }
    })
})

// Form for new post
app.get('/blogs/new', (req, res) => {
    res.render('newPost.ejs');
})


// Post new blog post
app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (error, newBlog) => {
        if(error) {
            console.log('ERROR. Could not create post: ' + error);
        } else {
            res.redirect('/blogs/'+newBlog.id);
        }
    })
})

// Show specific blog post
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (error, blogPost) => {
        if(error) {
            // Fix blog not found
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: blogPost});
        }
    })
})

// Edit post
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (error, blogPost) => {
        if(error) {
            // Fix blog not found
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: blogPost});
        }
    })
})

// Update post
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);  // Sanitize to remove scripts from body :)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (error, blogPost) => {
        if (error) {
            res.redirect('/blogs/'+req.params.id);  // TODO: kontrollera!
            console.log('ERROR: ' + error);
        } else {
            res.redirect('/blogs/'+req.params.id);
        }
    })
})

// Delete post
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (error, blog) => {
        if (error) {
            res.redirect('/blogs/'+req.params.id);  // TODO: kontrollera!
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