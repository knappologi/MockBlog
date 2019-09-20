const express = require('express');
const app = express();
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true, useFindAndModify: false });
const methodOverride = require('method-override');
const url = require('url');

const   Post = require('./associations/models/post');
        Comment = require('./associations/models/comment');
        User = require('./associations/models/user');

const   indexRoutes     = require('./routes/index');  
        postsRoutes    = require('./routes/posts');
        commentsRoutes  = require('./routes/comments');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended:true})); 
app.use(methodOverride('_method'));

// Passport: For session and coding/decoding
const   passport = require('passport');
        LocalStrategy = require('passport-local');
        passportLocalMongoose = require('passport-local-mongoose');
app.use(require('express-session')({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   //Based on passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


        

// Info to all views
app.use((req, res, next) => {
    res.locals.currentView = (req.url.includes('posts/new') || req.url.includes('login') || req.url.includes('register')) ? req.url : 'standard';
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(commentsRoutes);    // can also be shortened: /place/:id/comments
app.use(postsRoutes);

/*
app.get('/', (req, res) => {
    res.redirect('/posts');
})


app.get('/posts', (req, res) => {
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

*/


app.use((req, res) =>{
    res.status(404);
  
    // html response
    if (req.accepts('html')) {
        res.render('notFound');
      return;
    }
  
    // json response
    if (req.accepts('json')) {
      res.send({ error: 'Page not found' });
      return;
    }
  });


app.listen(3000, () => {
    console.log('Blog is up!');
})




