'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StarSchema = new Schema({
  user_id: Number,
  id: Number,
  full_name: { type: String, index: true },
  description: String,
  homepage: String,
  created_at: Date,
  updated_at: Date,
  pushed_at: Date,
  stargazers_count: Number,
  watchers_count: Number,
  forks_count: Number,
  language: String,
  tags: [String]
});

StarSchema.index({ user_id: 1, id: 1 }, { unique: true });

StarSchema.methods.setTags = function(tags, callback) {
  var user_id = this.user_id
    , repo_id = this.id;
  var conditions = {
    user_id: user_id,
    id: repo_id
  };
  this.model('Star').findOne(conditions, function(err, star) {
    if (err) {
      return callback(err);
    }
  });
};

module.exports = mongoose.model('Star', StarSchema);
