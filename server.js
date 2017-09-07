var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var now = 1;

app.use('/', express.static(__dirname));
server.listen(8888);
console.log('Server started');

io.on('connect', function(socket) {

    socket.userId = now;
    users.push(now);
    now++;
    socket.emit('loginSuccess', socket.userId);
    io.sockets.emit('system', users);
    console.log(users);

    console.log('user ' + socket.userId + ' login in.');
    socket.on('disconnect', function() {
        users.splice(users.indexOf(socket.userId), 1);
        socket.broadcast.emit('system', users);
        socket.broadcast.emit('cut', socket.userId);
        console.log(users);
        console.log('user ' + socket.userId + ' leave.');
    });

    socket.on('challenge', function(from, to) {
        console.log('user ' + from + ' challenge user ' + to);
        socket.broadcast.emit('challenge', from, to);
    });

    socket.on('accept', function(from, to) {
        socket.broadcast.emit('accept', from, to);
    });

    socket.on('acceptAc', function(from) {
        socket.broadcast.emit('acceptAc', from);
        console.log('acceptAc');
    });

    socket.on('not_accept', function(from) {
        socket.broadcast.emit('not_accept', from);
    });

    socket.on('busy', function(from, to) {
        socket.broadcast.emit('busy', from, to);
    });

    socket.on('yourturn', function(who, i, j) {
        socket.broadcast.emit('yourturn', who, i, j);
    });

    socket.on('giveup', function(who) {
        socket.broadcast.emit('giveup', who);
    });

    socket.on('back', function(who) {
        socket.broadcast.emit('back', who);
    });

    socket.on('agree', function(who) {
        socket.broadcast.emit('agree', who);
    });

    socket.on('notAgree', function(who) {
        socket.broadcast.emit('notAgree', who);
    });

});