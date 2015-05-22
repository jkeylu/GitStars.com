'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RepoSchema = new Schema({
  full_name: String,
  readme: String,
  gs_readme_updated_at: Date
});

module.exports = mongoose.model('Repo', RepoSchema);
