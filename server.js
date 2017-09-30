//takes all the express capabilites and puts into the express
var express = require('express');

var app = express();

//HTTP
var http = require('http').createServer(app);

var server = app.listen(8080);

var Twit = require('twit');

var io = require('socket.io').listen(server);

// Twit is a class 
//if you push in github take these out for security
var TwitterAPI = new Twit({
	consumer_key: 'AsA90bQgMld4tzrDdSWE97GvT',
	consumer_secret: 'tnQXkVQnFLIXPvFME9Di0zIu9W73WgWAKPxZr1DboY4QCiF3mj',
	access_token: '3305667387-gSLZf19ssk4ny3wUwEVwcuJze87ZaTGwXJ87ojj',
	access_token_secret: 'bcgcybQtzjp8bt2E4u4sgwnaYzcSrF7Q3RH1xVkumbShs',
	timeout_ms: 60 * 1000 // will close 
});

console.log('yay our server is running!');

//EJS templating library
//will tell that we are gonna write vanilla html
var ejs = require('ejs');

//tell the server where is the dict of the files 
//dirname:  this root directory
app.set('views', __dirname + '/views');

//setup public library
app.use(express.static(__dirname + '/public'));

//ejs setup
app.engine('.html', ejs.__express);
app.set('view-engine', 'html');

//will filter the tweets
// dig in to the twit API to see the methods
var tweetStream = TwitterAPI.stream('statuses/filter', {track: 'Creative'});

// event listener
// tweet contains everything. mostly unneccesary stuff like user details
// filter only the tweets texts
tweetStream.on('tweet', function(tweet) {
	// we are sending 
	io.sockets.emit('note', tweet.text, tweet.user.screen_name, tweet.user.followers_count);

	// filter with reggex \n
	console.log(tweet.text + '\n');

});


// get the root folder and run a func
app.get('/', function(req, res){
	res.render('index.html');
});
