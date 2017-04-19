var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine','ejs');

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

		// socket.on('random', function(data) {
		// 	var arraynum = data.arraynum;
		// 	console.log(arraynum);
		// 	io.emit('output_random',arraynum);
		// });
		socket.on('getdata_rand',function(data){
			setting.find().limit(100).toArray(function(err,res){
				// console.log(res);
				io.emit('data_rand',res);
				console.log('yes');
			});
		});
		socket.on('num_reward',function(data){
			console.log(data.num_reward-1);
			setting.updateOne({ "_id" : ObjectId(data._id)},{$set:{num_reward:data.num_reward-1}})
		});

	});



	var setting  = db.collection('setting');
	app.post('/store_setting', urlencodedParser, function (req, res) {
		var data = {
			chance:req.body.chance,
			num_reward:req.body.num_reward,
			image:req.body.img
		}
		setting.insert({chance:data.chance, num_reward:data.num_reward},function(){
			res.redirect("/setting");
		});
	});
	
	app.get('/setting',function(req,res){
		setting.find().limit(100).toArray(function(err,item){
			if (err) throw err;
				res.render('setting',{data:item});
		});
	});
	

	app.get('/store_delete',function(req,res){
		setting.remove({ "_id" : ObjectId(req.query._id) }, function(err, result) {
			console.log('removed');
			res.redirect("/setting");
		});
	});

	var setting_round = db.collection('round');
	app.get('/setting_round',function(req,res){
		setting_round.insert({round:req.query.round}, function(err,result){
			console.log(req.query.round);
		});
	});

});

