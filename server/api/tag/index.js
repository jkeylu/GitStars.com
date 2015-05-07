'use strict';

var express = require('express');
var controller = require('./tag.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.delete('/:name', auth.isAuthenticated(), controller.destroy);

module.exports = router;
