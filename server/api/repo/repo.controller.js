'use strict';

var _ = require('lodash');
var async = require('async');
var Repo = require('./repo.model');
var githubApi = require('../../components/github/api');

exports.readme = function(req, res) {
  var fullName = req.params.owner + '/' + req.params.repo;
  var conditions = { full_name: fullName };

  async.waterfall([
    // find in mongodb
    function(callback) {
      Repo.findOne(conditions, function(err, repo) {
        if (err) {
          return callback(err);
        }
        if (!repo) {
          return callback(null,null);
        }
        // readme will be cached one week in mongodb
        var oneWeek = 604800000; // 1000ms * 60 * 60 * 24 * 7
        var needRefresh = (new Date() - repo.gs_readme_updated_at) > oneWeek;
        if (needRefresh) {
          return callback(null, null);
        }
        callback(null, repo.readme);
      })
    },

    // fetch from github
    function(readme, callback) {
      if (readme) {
        return callback(null, readme);
      }
      githubApi.fetchReadme(fullName, req.user.access_token, function(err, readme) {
        if (err) {
          return callback(err);
        }
        var update = {
          full_name: fullName,
          readme: readme,
          gs_readme_updated_at: new Date()
        };
        var options = {
          upsert: true
        };
        Repo.findOneAndUpdate(conditions, update, options).exec();
        callback(null, readme);
      });
    }
  ], function(err, readme) {
    if(err) {
      return res.status(500).send(err);
    }
    return res.send(readme);
  });
};
