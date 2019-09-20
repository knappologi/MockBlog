const express = require('express');
const router = express.Router();
const   passport = require('passport');
const   User = require('../associations/models/user');
        Post = require('../associations/models/post');

// Start
router.get('/', (req, res) => {
    res.redirect('/posts');
})

// Login
router.get('/login', (req, res) => {
    res.render('login');
  });

// Register
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  let newUser = new User({username: req.body.user.username});
  User.register(newUser, req.body.user.password, (err, user) => { // Stores hash!
      if(err) {
          console.log('Register new user error: ' + err);
          return res.render('register', {error: err.message});
      }
      passport.authenticate('local')(req, res, ()=> {
        console.log('New user created: ' + newUser.username);
          //req.flash('success', 'New user registered.');
          res.redirect('/posts');
      })
  });  
})

module.exports = router;

