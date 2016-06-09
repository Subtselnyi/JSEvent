global.api = {};
api.fs = require('fs');
api.http = require('http');
api.websocket = require('websocket');
//api.url = require('url');

var index = api.fs.readFileSync('./index.html');

var server = api.http.createServer(function(req, res) {
  //var pathname = url.parse(req.url).pathname;
  //console.log("request for" + pathname +"recieved.");
  res.writeHead(200);
  res.end(index);
});

server.listen(80, function() {
  console.log('Listen port 80');
});

var ws = new api.websocket.server({
  httpServer: server,
  autoAcceptConnections: false
});

var clients = [];

ws.on('request', function(req) {
  var connection = req.accept('', req.origin);
  clients.push(connection);
  console.log('Connected ' + connection.remoteAddress);
  var ClientName = connection.remoteAddress;

      ClientName = JSON.stringify(ClientName);
      clients.forEach(function(client) {      
        client.send(ClientName);
    });

  connection.on('message', function(message) {
    var dataName = message.type + 'Data' ,
       data = message[dataName];
       data = JSON.parse(data);

       if (data.button==1) {
        clients.forEach(function(client) {
        data = JSON.stringify(data);
       console.log('Received: ' + data);
        
        client.send(data);

    });}

        if (data.button==2) {
        clients.forEach(function(client) {
        data = JSON.stringify(data);
       console.log('Received: ' + data);

        client.send(data);

    });}
        if(data.cell){
       data.user = connection.remoteAddress;
       data = JSON.stringify(data);
       console.log('Received: ' + data);


    clients.forEach(function(client) {
      if (connection !== client) {
        client.send(data);

      } }) }
    });
  connection.on('close', function(reasonCode, description) {
    console.log('Disconnected ' + connection.remoteAddress);
  });
});
