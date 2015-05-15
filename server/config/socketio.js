/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var clients = {};

// When the user disconnects.. perform this
function onDisconnect(socket) {
  if (socket.decoded_token) {
    var id = socket.decoded_token.id;
    if (id && clients[id]) {
      var index = clients[id].indexOf(socket);
      if (index > -1) {
        clients[id].splice(index, 1);

        if (clients[id].length == 0) {
          delete clients[id];
        }
      }
    }
  }
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  if (socket.decoded_token) {
    var id = socket.decoded_token.id;
    if (id) {
      if (!clients[id]) {
        clients[id] = [];
      }
      clients[id].push(socket);
    }
  }
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  socketio.use(require('socketio-jwt').authorize({
    secret: config.secrets.session,
    handshake: true
  }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });

  // Insert sockets below
  require('../api/star/star.socket').register(clients);
};
