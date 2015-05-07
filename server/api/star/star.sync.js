'use strict';

var async = require('async')
  , _ = require('lodash')
  , Star = require('./star.model');
  , githubApi = require('../../components/github');

var saveStarsQueue = async.queue(function(task, callback) {
  async.eachLimit(task.stars, 50, function(star, cb) {
    var conditions = {
      user_id: task.user_id,
      id: star.id
    };

    var update = _.pick(star, ['id', 'full_name', 'description',
      'stargazers_count', 'watchers_count', 'forks_count', 'language']);
    update.user_id = task.user_id;

    var options = { upsert: true };

    Star.findOneAndUpdate(conditions, update, options, cb);
  }, callback);
}, 1);

var fetchStarredQueue = async.queue(function(task, callback) {
  githubApi.fetchStarred(task.page, task.access_token, function(err, stars, pageCount) {
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

  var done = function(err) {
    savingCount--;
    if (fetchingCount == 0 && savingCount == 0) {
      callback(err);
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
        userId: user.id,
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
  return -1 < _.findIndex(fetchStarredQueue.tasks, function(task) {
    return task.data.id == user.id;
  });
}

exports.sync = sync;
exports.isSyncing = isSyncing;
