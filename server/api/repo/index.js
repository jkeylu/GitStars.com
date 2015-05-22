'use strict';

var express = require('express');
var controller = require('./repo.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:owner/:repo/readme', auth.isAuthenticated(), controller.readme);

module.exports = router;
