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
      var link = resp.headers['link'];
      if (link) {
        var count = getPageCount(link, 'last');
        if (count == -1) {
          count = getPageCount(link, 'prev');
          if (count > 0) {
            count = count + 1;
          } else {
            err = new HttpError(500, 'Can not parse link [' + link + ']');
            return callback(err);
          }
        }
        pageCount = count;
      }
      return callback(null, body, pageCount);
    } else {
      err = new HttpError(resp.statusCode, body && body.message || body);
      return callback(err);
    }
  });
};

function getPageCount(link, rel) {
  var patten = new RegExp('<.*?[?&]page=(\\d+)(&per_page=\\d+)?>\\s*;\\s*rel="' + rel + '"');
  var m = link.match(patten);
  if (m) {
    return ~~m[1];
  }
  return -1;
}

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

exports.fetchReadme = function(fullName, accessToken, callback) {
  var url = util.format('https://api.github.com/repos/%s/readme', fullName);
  var options = {
    parse_response: false,
    headers: { 'Authorization': 'Bearer ' + accessToken },
    accept: 'application/vnd.github.v3.html'
  };
  needle.get(url, options, function(err, resp, body) {
    if (err) {
      return callback(err);
    }

    if (resp.statusCode == 200) {
      return callback(null, body);
    } else {
      err = new HttpError(resp.statusCode, body && body.message || body);
      return callback(err);
    }
  });
};
