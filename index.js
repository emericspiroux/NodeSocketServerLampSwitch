var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var isOn = false

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  changeLampState(isOn);
});

app.get('/switchLamp', function(req, res){
	res.send('{"isOn":'+isOn+'}');
});

app.post('/switchLamp', function(req, res){
	changeLampState(isOn);
   	res.send('{"isOn":'+ isOn +'}', 200);
});

function changeLampState(state){
	if (typeof(state) === "boolean") {
	   	isOn = !isOn;

  		var isOnString = "1";
  		if (!isOn) {
    			isOnString = "0";
  		}
  		console.log("Status relay :" + isOnString);
  		io.emit('relay lamp', isOnString);
	}
}

io.on('connection', function(socket){
  console.log("Controller connected !")
  
  if (isOn == true){
	isOn = !isOn;
	changeLampState(isOn);
  }	

  socket.on('change gyro', function(value){
	console.log("Switch light !");
	changeLampState(isOn);
  });
  
  socket.on('disconnect', function(){
    console.log("Controller disconnected...");
  })

});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
