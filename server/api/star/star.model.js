'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StarSchema = new Schema({
  user_id: Number,
  id: Number,
  full_name: String,
  description: String,
  stargazers_count: Number,
  watchers_count: Number,
  forks_count: Number,
  tags: [String]
});

module.exports = mongoose.model('Star', StarSchema);
