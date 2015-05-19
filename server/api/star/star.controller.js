'use strict';

var _ = require('lodash');
var async = require('async');
var Star = require('./star.model');
var Tag = require('../tag/tag.model');
var User = require('../user/user.model')
var config = require('../../config/environment');
var starSync = require('./star.sync');

/**
 * Get list of stars
 */
exports.index = function(req, res) {
  var conditions = {
    user_id: req.user.id
  };
  var options = {
    skip: 0,
    limit: 100
  };
  var page = ~~req.query.page;
  if (page < 1) {
    page = 1;
  }
  options.skip = (page - 1) * 100;
  Star.find(conditions, null, options, function(err, stars) {
    if(err) {
      return res.status(500).send(err);
    }
    res.status(200).json(stars);
  });
};

exports.create = function(req, res) {
};

exports.destroy = function(req, res) {
  var userId = req.user.id
    , repoId = req.params.id;
  Star.findOneAndRemove({ user_id: userId, id: repoId }, function(err) {
  });
};

exports.sync = function(req, res) {
  User.findOne({ id: req.user.id }, 'gs_synced_at', function(err, user) {
    if (!err && user && user.gs_synced_at) {
      var gone = Math.floor((new Date() - user.gs_synced_at) / 1000);
      if (gone < 300) {
        return res.status(304).send({ waitting: (300 - gone) });
      }
    }
    if (starSync.isSyncing(req.user)) {
      return res.sendStatus(204);
    }
    starSync.sync(req.user, function(err) {
      if (err) {
        console.error(err);
        if (err.stack) {
          console.log(err.stack);
        }
      }
    });
    res.sendStatus(202);
  });
};

exports.updateTags = function(req, res) {
  var userId = req.user.id
    , repoId = req.params.id
    , tags = _.compact(_.uniq(req.body));

  Star.findOne({ user_id: userId, id: repoId }, function(err, star) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!star) {
      return res.sendStatus(404);
    }

    var intersection = _.intersection(star.tags, tags);
    var newTags = _.difference(tags, intersection);
    var needlessTags = _.difference(star.tags, intersection);

    star.tags = tags;
    star.save(function(err) {
      if (err) {
        return res.status(500).send(err);
      }

      async.parallel([
        function(callback) {
          if (newTags.lenght == 0) {
            return callback();
          }
          async.each(newTags, function(tagName, cb) {
            Tag.increaseCount({ user_id: userId, name: tagName }, cb);
          }, callback);
        },
        function(callback) {
          if (needlessTags.length == 0) {
            return callback();
          }
          async.each(needlessTags, function(tagName, cb) {
            Tag.decreaseCount({ user_id: userId, name: tagName }, cb);
          }, callback);
        }
      ],
      function(err) {
        // TODO: Log error
        res.sendStatus(204);
      });
    });
  });
};

exports.removeTag = function(req, res) {
  var userId = req.user.id
    , repoId = req.params.id
    , tagName = req.params.tag;

  Star.findOne({ user_id: userId, id: repoId }, function(err, star) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!star) {
      return res.sendStatus(404);
    }
    if (_.indexOf(star.tags, tagName) < 0) {
      return res.sendStatus(204);
    }

    _.pull(star.tags, tagName);
    star.markModified('tags');
    star.save(function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      Tag.decreaseCount({ user_id: userId, name: tagName }, function(err) {
        // TODO: Log error
        res.sendStatus(204);
      });
    });
  });
};
