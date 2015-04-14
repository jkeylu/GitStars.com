'use strict';

var Star = require('./star.model');
var config = require('../../config/environment');

/**
 * Get list of stars
 */
exports.index = function(req, res) {
  var conditions = {
    user_id: req.user.id;
  };
  Star.find(conditions, function(err, stars) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};
