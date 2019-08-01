const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let ball = {};

io.on('connection', function(socket){
  socket.on('ball point', (e) => {
    console.log(e);
    ball = JSON.parse(e);
    io.emit('ball point', e);
  });
  socket.on('enemy point', (e) => {
    console.log("emeny", e);
    io.emit('enemy point', e);
  })
});

http.listen(3030, function(){
  console.log('listening on *:3030');
});