'use strict';

var express = require('express');
var controller = require('./star.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.put('/', auth.isAuthenticated(), controller.sync);
router.post('/', auth.isAuthenticated(), controller.create);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.put('/:id/tags', auth.isAuthenticated(), controller.updateTags);
router.delete('/:id/tags/:tag', auth.isAuthenticated(), controller.removeTag);

module.exports = router;
