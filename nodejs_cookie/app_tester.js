var express = require('express');
var request = require('request');
var fs = require('fs');
var csv = require('csvtojson')
var app = express();

var conversations = ['hola','contratar','vida','partenon']
var csvFilePath = "my.csv"

csv({noheader:true})
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    // combine csv header row and csv line to a json object 
    // jsonObj.a ==> 1 or 4 
    console.log(jsonObj)
})
.on('done',(error)=>{
    console.log('end')
})


var options = { method: 'POST',
  url: 'https://asistente-santander-seguros-test.eu-gb.mybluemix.net/api/message/',
  headers: 
   {
     'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: 
   {},
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var id = body.context.conversation_id;
  var pos=0;
    //console.log(body);

    var options = { method: 'POST',
      url: 'https://asistente-santander-seguros-test.eu-gb.mybluemix.net/api/message/',
      headers: 
       {
         'cache-control': 'no-cache',
         'content-type': 'application/json' },
      body: 
       { input: { text: conversations[pos] },
         context: { conversation_id: id } },
      json: true };

    sendMsg(options,pos)
  
});


function sendMsg(options,contador){
  if(contador<conversations.length){
      request(options, function (error, response, body) {
        var contexto = body.context;
        console.log("OUTPUT_",body.output)
        var options = { method: 'POST',
          url: 'https://asistente-santander-seguros-test.eu-gb.mybluemix.net/api/message/',
          headers: 
           {
             'cache-control': 'no-cache',
             'content-type': 'application/json' },
          body: 
           { input: { text: conversations[contador+1] },
             context: contexto },
          json: true };

          sendMsg(options,contador+1)
    });
  }
}


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});