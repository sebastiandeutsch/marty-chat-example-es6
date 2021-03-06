var Marty = require('marty');
var RoomsStore = require('../stores/roomsStore');
var MessagesStore = require('../stores/messagesStore');
var SocketStateSource = require('marty-socket.io-state-source');
var RoomActionCreators = require('../actions/roomActionCreators');
var MessageActionCreators = require('../actions/messageActionCreators');

var ServerUpdatesSocket = Marty.createStateSource({
  id: 'ServerUpdatesSocket',
  mixins: [SocketStateSource()],
  events: {
    'message': 'onMessage',
    'room:created': 'onRoomCreated'
  },
  onMessage(message) {
    if (!MessagesStore.getMessage(message.id, message.roomId)) {
      MessageActionCreators.recieveMessages(message.roomId, [message]);
    }
  },
  onRoomCreated(room) {
    if (!RoomsStore.roomExists(room.id)) {
      RoomActionCreators.recieveRooms([room]);
    }
  }
});

module.exports = ServerUpdatesSocket;