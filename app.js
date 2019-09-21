const express = require('express');
const app = express();
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true, useFindAndModify: false });
const methodOverride = require('method-override');
const url = require('url');

const   User = require('./associations/models/user');

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
    res.locals.currentView = (req.url.includes('comments/') || req.url.includes('posts/new') || req.url.includes('login') || req.url.includes('register')) ? req.url : 'standard';
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(commentsRoutes);    // can also be shortened: /place/:id/comments
app.use(postsRoutes);


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




