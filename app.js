var express = require('express');
http = require('http');
var spawn = require('child_process').spawn;
var fs=require('fs');
var socketio_stuff=require('./socketio_stuf');
var route2048 = require('./routes/2048');
var app = express();
var server = http.createServer(app);
io = require('socket.io')(server);

io.on('connection',socketio_stuff.main_function);
app.use(express.static(__dirname+'/statics'));
app.get('/', route2048.temp2048);
var port = process.env.PORT || 8080;
server.listen(port, function() {
    console.log("Listening on " + port);
});

var zz=1;


