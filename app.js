const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const http = require('http');

// Connection URL
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then(() => {
  console.log('Connected correctly to NoSQL Database');
}, (err) => { console.log(err); });

// const index = require('./routes/indexRouter');
// const users = require('./routes/users');

const app = express();

// Adding routes to the project


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

const io = require('socket.io')(server);

global.participants = [];
console.log('participants app', global.participants);


io.on('connection', (socket) => {
  socket.on('connect_new_user', (data) => {
    const newParticipant = {
      socketId: socket.id,
      userId: data.userId,
      chats: data.chats
    };

    const currentUserPaticipant =
      global.participants.find(participant => participant.userId === data.userId);

    if (currentUserPaticipant) {
      global.participants =
        global.participants.filter(participant => participant.userId !== data.userId);
    }

    global.participants.push(newParticipant);

    const newParticipantChats = global.participants.filter((participant) => {
      let isToReturn = false;

      participant.chats.forEach(chatId => {
        if (data && data.chats && data.chats.includes(chatId)) {
          isToReturn = true;
        }
      });

      return isToReturn;
    });

    newParticipantChats.forEach((participant) => {
      io.sockets.connected[participant.socketId].emit('new_user_online', data.userId);
    });
    console.log('connect_new_user participants', global.participants);
  });

  socket.on('user_printing_message_start', (data) => {
    const currentChatParticipants = global.participants.filter(participant =>
      participant.chats.includes(Number(data.chatId)));

    currentChatParticipants.forEach((participant) => {
      if (io.sockets.connected[participant.socketId]) {
        io.sockets.connected[participant.socketId]
          .emit('user_printing_message_in_chat_start', data);
      }
    });
  });

  socket.on('user_printing_message_stop', (data) => {
    const currentChatParticipants = global.participants.filter(participant =>
      participant.chats.includes(Number(data.chatId)));

    currentChatParticipants.forEach((participant) => {
      if (io.sockets.connected[participant.socketId]) {
        io.sockets.connected[participant.socketId]
          .emit('user_printing_message_in_chat_stop', data);
      }
    });
  });

  socket.on('disconnect_user', (data) => {
    const userDisconnecting = global.participants.find(participant => participant.userId === data);
    const newParticipantChats = global.participants.filter((participant) => {
      let isToReturn = false;

      participant.chats.forEach(chatId => {
        if (userDisconnecting && userDisconnecting.chats
          && userDisconnecting.chats.includes(chatId)) {
          isToReturn = true;
        }
      });

      return isToReturn;
    });

    newParticipantChats.forEach((participant) => {
      io.sockets.connected[participant.socketId].emit('new_user_offline', userDisconnecting.userId);
    });

    global.participants = global.participants.filter(participant => participant.userId !== data);
  });
});

routes(app, io, global.participants);

server.listen('3030', () => {
  console.log(`Server running at http://localhost:3030/`);
});

module.exports = app;
