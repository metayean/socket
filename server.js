var mongo = require('mongodb').MongoClient;
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


server.listen(8081);
//read file view
app.get('/app',function(req,res){
	res.sendFile(__dirname+"/mobile.html");
});
app.get('/index',function(req,res){
	res.sendFile(__dirname+"/index.html");
});



//connect mongodb
mongo.connect('mongodb://localhost/app', function (err,db){
	if(err) throw err;
	io.on('connection', function(socket){

		var col  = db.collection('event');
		// col.find().limit(100).sort({_id: 1}).toArray(function(err,res){
		// 	if(err) throw err;
		// 	socket.emit('output',res);
		// 	// console.log(res);
		// });

		socket.on('input',function(data){
			var token = data.id,
				name = data.name,
				picture = data.picture;

			// console.log('data');
			col.insert({token: token, name: name, picture: picture}, function (){
				console.log('Inserted');
			});

			io.emit('output',[data]);
			// console.log([data]);
		});

		console.log('hello');

	});
});


// var express = require('express');
// var app = express();

// app.get('/app',function(req,res){
// 	res.sendFile(__dirname+"/"+"index.html");
// });
// app.listen(8081);


