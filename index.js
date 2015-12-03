var express = require('express');
var http = require('http');
var parser = require('xml2json');
var okrabyte = require('okrabyte');
var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'tmp/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
});

var app = express();

app.get('/', function(req,res,next) {
    res.send('Nothing here');
});

app.post('/recognize', upload.single('file'), function(req, res, next) {
    console.log(req.file.path);
    // okrabyte.decodeFile(req.file.path, function(error, data){
    //     if (error) console.log(error);
    //     console.log(data);
    //     res.send(data);
    // });
    var buffer = fs.readFileSync(req.file.path);
    okrabyte.decodeBuffer(buffer, function(error, data){
        console.log(data);
        res.send(data);
    });
});

app.get('/compute/:query', function(req,res,next) {
    // console.log($);
    // $.get('http://api.wolframalpha.com/v2/query?appid=H269PU-6G343G2Q7K&input=' + req.params.query, function(data) {
        // res.send($);
    // });
    var options = {
        host: 'http://api.wolframalpha.com',
        path: '/v2/query?appid=H269PU-6G343G2Q7K&input=' + req.params.query
    };
    http.get('http://api.wolframalpha.com/v2/query?appid={INSERT_API_KEY_HERE}&input=' + req.params.query, function(resp) {
        resp.on('data', function(chunk) {
            // console.log(chunk);
            // console.log('' + chunk);
            res.send(parser.toJson('' + chunk));
            // res.send(parseString(''+chunk, function(err,res2) {
            //     if (err) throw err;
            //     res.send(res2);
            // }));
        });
    }).on('error', function(e) {
        res.send(e);
    });
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('listening on http://%s:%s', host, port);
});