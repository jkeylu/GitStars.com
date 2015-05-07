'use strict';

var util = require('util')
  , needle = require('needle')
  , pkg = require('../../../package.json');

needle.defaults({
  accept: 'application/vnd.github.v3+json',
  user_agent: pkg.name + '/' + pkg.version
});

function HttpError(statusCode, message) {
  Error.call(this);
  this.statusCode = statusCode;
  this.message = message;
}
util.inherits(HttpError, Error);
exports.HttpError = HttpError;

exports.fetchStarred = function(page, accessToken, callback) {
  var url = util.format('https://api.github.com/user/starred?page=%d&per_page=100', page);
  var options = {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  };
  needle.get(url, options, function(err, resp, body) {
    if (err) {
      return callback(err);
    }

    if (resp.statusCode == 200) {
      var pageCount = 1;
      var link = resp.headers['Link'];
      if (link) {
        var m = link.match(/<.*?page=(\d+)>\s*;\s*rel="last"/);
        if (m.length > 1 && (~~m[1] > 0)) {
          pageCount = ~~m[1];
        }
      }
      return callback(null, body, pageCount);
    } else {
      err = new HttpError(resp.statusCode, body && body.message || body);
      return callback(err);
    }
  });
};

exports.star = function(owner, repo, accessToken, callback) {
  var url = util.format('https://api.github.com/user/starred/%s/%s', owner, repo);
  var options = {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Length': 0
    }
  };
  needle.put(url, null, options, function(err, resp, body) {
    if (err) {
      return callback(err);
    }

    if (resp.statusCode == 204) {
      return callback(null);
    } else {
      err = new HttpError(resp.statusCode, body && body.message || body);
      return callback(err);
    }
  });
};

exports.unstart = function(owner, repo, accessToken, callback) {
  var url = util.format('https://api.github.com/user/starred/%s/%s', owner, repo);
  var options = {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  };
  needle.delete(url, null, options, function(err, resp, body) {
    if (err) {
      return callback(err);
    }

    if (resp.statusCode == 204) {
      return callback(null);
    } else {
      err = new HttpError(resp.statusCode, body && body.message || body);
      return callback(err);
    }
  });
};
