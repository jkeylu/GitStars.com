'use strict';

var async = require('async')
  , _ = require('lodash')
  , Star = require('./star.model')
  , User = require('../user/user.model')
  , githubApi = require('../../components/github/api');

var saveStarsQueue = async.queue(function(task, callback) {
  var repos = [];
  async.eachLimit(task.stars, 50, function(star, cb) {
    repos.push(star.id);
    var conditions = {
      user_id: task.user_id,
      id: star.id
    };

    var update = _.pick(star, ['id', 'full_name', 'description', 'homepage',
      'created_at', 'updated_at', 'pushed_at',
      'stargazers_count', 'watchers_count', 'forks_count', 'language']);
    update.user_id = task.user_id;
    update.gs_unstarred_at = undefined;

    var options = { new: true, upsert: true };

    Star.findOneAndUpdate(conditions, update, options, cb);
  }, function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, repos);
  });
}, 1);

var currentTasks = [];
var fetchStarredQueue = async.queue(function(task, callback) {
  currentTasks.push(task);
  githubApi.fetchStarred(task.page, task.access_token, function(err, stars, pageCount) {
    _.pull(currentTasks, task);
    if (err) {
      return callback(err);
    }
    saveStarsQueue.push({ user_id: task.user_id, stars: stars }, task.cb);
    callback(null, pageCount);
  });
}, 8);

function sync(user, callback) {
  var fetchingCount = 0
    , savingCount = 0;

  var errors = [];
  var allStarredRepos = [];
  var done = function(err, repos) {
    if (err) {
      errors.push(err);
    } else {
      allStarredRepos = allStarredRepos.concat(repos);
    }
    savingCount--;
    if (fetchingCount == 0 && savingCount == 0) {
      if (errors.length > 0) {
        // TODO: Log all errors
        return callback(errors[0]);
      }

      var conditions = {
        user_id: user.id,
        id: {
          $nin: allStarredRepos
        }
      };
      var now = new Date();
      Star.update(conditions, { gs_unstarred_at: now }, function(err) {
        if (err) {
          return callback(err);
        }
        User.findOneAndUpdate(
          { id: user.id },
          { gs_synced_at: now },
          function(err) {
            callback(err);
          }
        );
      })
    }
  };

  var task = {
    user_id: user.id,
    page: 1,
    access_token: user.access_token,
    cb: done
  };

  fetchingCount++;
  fetchStarredQueue.push(task, function(err, pageCount) {
    fetchingCount--;

    savingCount++;
    if (err) {
      return done(err);
    }

    if (pageCount < 2) {
      return;
    }

    fetchingCount += pageCount - 1;

    for (var i = 2; i <= pageCount; i++) {
      task = {
        user_id: user.id,
        page: i,
        access_token: user.access_token,
        cb: done
      };
      fetchStarredQueue.push(task, function(err) {
        fetchingCount--;
        if (err == null) {
          savingCount++;
        }
      });
    }
  });
}

function isSyncing(user) {
  return _.findIndex(currentTasks,
      function(t) { return t.user_id == user.id; }) > -1
    || _.findIndex(fetchStarredQueue.tasks,
      function(t) { return t.data.user_id == user.id; }) > -1;
}

exports.sync = sync;
exports.isSyncing = isSyncing;
