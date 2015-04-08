var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var opts = require('nomnom').parse();
var app = express()

var redis_port = opts.redis;
if (!redis_port) {
  redis_port = 6379;
}

console.log("Connecting to redis on port " + redis_port);

var client = redis.createClient(redis_port, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);
	client.lpush("mostRecentLst", req.url);
	client.ltrim("mostRecentLst", 0 , 4);

	next(); // Passing the request to the next handler in the stack.
});


// app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
//    console.log(req.body) // form fields
//    console.log(req.files) // form files

//    if( req.files.image )
//    {
// 	   fs.readFile( req.files.image.path, function (err, data) {
// 	  		if (err) throw err;
// 	  		var img = new Buffer(data).toString('base64');
// 	  		console.log(img);
// 		});
// 	}

//    res.status(204).end()
// }]);

// app.get('/meow', function(req, res) {
// 	{
// 		if (err) throw err
// 		res.writeHead(200, {'content-type':'text/html'});
// 		items.forEach(function (imagedata) 
// 		{
//    		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
// 		});
//    	res.end();
// 	}
// })


app.get('/', function(req, res){
	{
		res.send('hello world');
	}
});

app.get('/get', function(req, res){
	{
		client.get("theKeyToHappiness", function(err,value){
			console.log(value);
			res.send(value);
		});
	}
});


app.get('/set', function(req, res){
	{
		client.set("theKeyToHappiness", "Don't worry, be happy");
		client.expire("theKeyToHappiness", 10);
		res.send('set');
	}
});

app.get('/recent', function(req, res){
	{
		client.lrange("mostRecentLst", 0, 5, function(err, value){
			res.send(value[1]);
			console.log("Most Recent:" + value);
		});
	}
})

// HTTP SERVER
var httpPort = opts.web
if (!httpPort) httpPort = 3000;
var server = app.listen(httpPort, function () {

   var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
})

