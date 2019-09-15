const express = require('express');
const router = express.Router();
// const   passport = require('passport');
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

module.exports = router;

