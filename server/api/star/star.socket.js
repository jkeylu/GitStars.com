'use strict';

var Star = require('./star.model');

exports.register = function(clients) {
  Star.hooks.post('findOneAndUpdate', function(doc) {
    onSave(clients, doc);
  });
  Star.hooks.post('findOneAndRemove', function(doc) {
    onRemove(clients, doc);
  });
  Star.schema.post('save', function(doc) {
    onSave(clients, doc);
  });
  Star.schema.post('remove', function(doc) {
    onRemove(clients, doc);
  });
};

function onSave(clients, doc) {
  var id = doc.user_id;
  if (id && clients[id]) {
    for (var i = 0; i < clients[id].length; i++) {
      clients[id][i].emit('star:save', doc);
    }
  }
}

function onRemove(clients, doc) {
  var id = doc.user_id;
  if (id && clients[id]) {
    for (var i = 0; i < clients[id].length; i++) {
      clients[id][i].emit('star:remove', doc);
    }
  }
}

