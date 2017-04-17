var express = require('express');
var request = require('request');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});


var http = require("http");

var options = {
  "method": "GET",
  "hostname": "37.58.122.242",
  "port": null,
  "path": "/vivisimo/cgi-bin/admin.exe?project=query-meta&id=login.logged&redirect-url=&username=data-explorer-admin&password=TH1nk1710",
  "headers": {
    "cache-control": "no-cache"
      }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
    console.log("res",res.headers)
  });
});

req.end();


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});