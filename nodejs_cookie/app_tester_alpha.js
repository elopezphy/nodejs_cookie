var express = require('express');
var request = require('request');
var fs = require('fs');
var csv = require('csvtojson')
var csv_ = require('fast-csv')
var app = express();

var conversations = ['hola','contratar','vida','partenon']
var csvFilePath = "my.csv"


csv({noheader:true})
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    // combine csv header row and csv line to a json object 
    // jsonObj.a ==> 1 or 4 
  //  console.log(Object.keys(jsonObj).length)
})
.on('done',(error)=>{
   // console.log('end')
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

csv_
 .fromPath("my.csv")
 .on("data", function(data){
     console.log(data);
     console.log("-------------------------------------------")
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
             { input: { text: data[pos] },
               context: { conversation_id: id } },
            json: true };

          sendMsg(options,pos,data)
        
      });     
 })
 .on("end", function(){
     console.log("done");
 });







function sendMsg(options,contador,data){
  if(contador<data.length){
      request(options, function (error, response, body) {
        var contexto = body.context;

        fs.appendFile(body.context.conversation_id+".txt", body.input.text+"->"+body.output.text+"\n", function(err){
         if (err) throw err;
          console.log("success");
        });   

        console.log("INPUT______________",body.input)
        console.log("CONVERSATION________",body.context.conversation_id)
        console.log("OUTPUT______________",body.output)
        var options = { method: 'POST',
          url: 'https://asistente-santander-seguros-test.eu-gb.mybluemix.net/api/message/',
          headers: 
           {
             'cache-control': 'no-cache',
             'content-type': 'application/json' },
          body: 
           { input: { text: data[contador+1] },
             context: contexto },
          json: true };

          sendMsg(options,contador+1,data)
    });
  }
}


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});