'use strict';

var Tag = require('./tag.model');
var config = require('../../config/environment');

/**
 * Get list of stars
 */
exports.index = function(req, res) {
  var conditions = {
    user_id: req.user.id
  };
  Tag.find(conditions, function(err, tags) {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(tags);
  });
};

exports.create = function(req, res) {
  var newTag = new Tag(req.body);
  newTag.count = 0;
  newTag.save(function(err, tag) {
    // TODO:
  });
};

exports.destroy = function(req, res) {
  var conditions = {
    user_id: req.user.id,
    name: req.params.name
  };
  // TODO: delete from stars
  Tag.findOneAndRemove(conditions, function(err) {
  });
};
