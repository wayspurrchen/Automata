var express = require('express');
var app     = express();
var server  = app.listen(3000);

app.use(express.static(__dirname + '/public'));