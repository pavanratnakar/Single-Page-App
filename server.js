var express = require('express'),
	fs = require('fs'),
	app = express();

app.get('/', function(req, res){
    res.end(fs.readFileSync('index.html'));
});

app.use('/dist', express.static(__dirname + '/dist'));
app.use('/data', express.static(__dirname + '/data'));

app.listen(8001);