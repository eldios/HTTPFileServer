var express = require('express') ,
	url = require('url'),
  fs = require('fs') ,
  stat = require('node-static');
var HTTP_port;
var app = express.createServer();
var staticSrv = new (stat.Server)('./');

app.configure('dev', function(){
  HTTP_port = 60080 ;
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger(),function(){
    
    });
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('prod', function(){
  var oneYear = 31557600000;
  HTTP_port = 80 ;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('views');
  app.set('view engine', 'jade');
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
});

app.get('/',function(req,res){
  var filesDir = './';
  fs.readdir(filesDir,function(err,files){
    return res.render('root', { files : files });
  });
});

/*
app.get('/*',function(req,res){
  console.log("==>Static modules in use<==\n");
  staticSrv.serveFile(filename,req,res);
});
*/

try {
  if (HTTP_port) {
    app.listen(HTTP_port);
		console.log("HTTPFileServer is ready and listening on port " + HTTP_port);
  } else {
    throw "No working env specified .. use \"NODE_ENV='prod' node app.js\" or \"NODE_ENV='dev' node app.js\""
  }
} catch (err) {
  console.log("Error: " + err);
};
