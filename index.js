var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var isOn = false

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');

  isOn = !isOn;

  var isOnString = "1";
  if (!isOn) {
    isOnString = "0";
  }
  console.log("Status relay :" + isOnString);
  io.emit('relay lamp', isOnString);
});

io.on('connection', function(socket){
  console.log("Controller connected !")

  socket.on('interruptor lamp', function(value){
	console.log("Lamp on");
  });
  
  socket.on('disconnect', function(){
    console.log("Controller disconnected...");
  })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
