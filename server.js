var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(__dirname + ''));


server.listen(8081);
//read file view
app.get('/app',function(req,res){
	res.sendFile(__dirname+"/mobile.html");
});
app.get('/index',function(req,res){
	res.sendFile(__dirname+"/index.html");
});

app.get('/setting/create',function(req,res){
	res.sendFile(__dirname+"/create.html");
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
				col.insert({token: token, name: name, picture: picture}, function (){
				console.log('Inserted');
			});
			io.emit('output',[data]);
		});

		console.log('hello');

		socket.on('logout', function(data) {
			console.log(data);
			io.emit('logout',[data]);
		});

		socket.on('random', function(data) {
			var arraynum = data.arraynum;
			console.log(arraynum);
			io.emit('output_random',arraynum);
		});
		
		socket.on('setting', function(data) {
				var setting  = db.collection('setting');
					console.log(data);
				setting.find().limit(100).sort({_id: 1}).toArray(function(err,res){
						io.emit('setting',res);
				});
			});
	});



	var setting  = db.collection('setting');
	
	app.post('/store_setting', urlencodedParser, function (req, res) {
		var data = {
			chance:req.body.chance,
			num_reward:req.body.num_reward,
			num_round:req.body.num_round,
			image:req.body.img
		}
		setting.insert({chance:data.chance, num_reward:data.num_reward, num_round:data.num_round},function(){
			res.redirect("/setting");
		});
	});
	app.get('/setting',function(req,res){
		res.sendFile(__dirname+"/setting.html");
		// setting.find().limit(100).sort({_id: 1}).toArray(function(err,res){
		// 	io.emit('setting',res);
		// 	console.log(res);
		// });
	});

});


// var express = require('express');
// var app = express();

// app.get('/app',function(req,res){
// 	res.sendFile(__dirname+"/"+"index.html");
// });
// app.listen(8081);


