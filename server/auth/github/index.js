'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('github', {
    failureRedirect: '/',
    scope: [ 'public_repo' ],
    session: false
  }))

  .get('/callback', passport.authenticate('github', {
    failureRedirect: '/',
    session: false
  }), auth.setTokenCookie);

module.exports = router;
