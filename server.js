var express = require('express');
var app = express();
var io = require('socket.io').sockets;
var mongo = require('mongodb').MongoClient;

app.get('/app',function(req,res){
	res.sendFile(__dirname+"/"+"index.html");
});
app.listen(8081);


mongo.connect('mongodb://127.0.0.1/app', function (err,db){
	if(err) throw err;

	console.log('hello');

	});


// var express = require('express');
// var app = express();

// app.get('/app',function(req,res){
// 	res.sendFile(__dirname+"/"+"index.html");
// });
// app.listen(8081);


