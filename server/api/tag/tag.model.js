'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
  user_id: Number,
  name: String,
  count: { type: Number, default: 0 }
});

TagSchema.index({ user_id: 1, name: 1 }, { unique: true });

TagSchema.statics.increaseCount = function(tag, callback) {
  var conditions = {
    user_id: tag.user_id,
    name: tag.name
  };
  var update = { $inc: { count: 1 } };
  var options = { upsert: true };
  this.findOneAndUpdate(conditions, update, options).exec(callback);
};

TagSchema.statics.decreaseCount = function(tag, callback) {
  var conditions = {
    user_id: tag.user_id,
    name: tag.name,
    count: { $gt: 0 }
  };
  var update = { $inc: { count: -1 } };
  this.findOneAndUpdate(conditions, update).exec(callback);
};

TagSchema.statics.clearZeroCountByUserId = function(userId, callback) {
  var conditions = {
    user_id: userId,
    count: { $lte: 0 }
  };
  this.remove(conditions).exec(callback);
};

module.exports = mongoose.model('Tag', TagSchema);
