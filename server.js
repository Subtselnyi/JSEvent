global.api = {};
api.fs = require('fs');
api.http = require('http');
api.websocket = require('websocket');

var index = api.fs.readFileSync('./index.html');

var server = api.http.createServer(function(req, res) {
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

        if (data.cell=='button1') {
          data = JSON.stringify(data);
          clients.forEach(function(client) {        
            console.log('Received button1: ' + data);        
            client.send(data);
          });
        }

        else if (data.cell=='button2') {
          data = JSON.stringify(data);
          clients.forEach(function(client) {        
            console.log('Received button2: ' + data);
            client.send(data);
          });
        }

        else if (data.cell=='button3'){
          data.user = connection.remoteAddress;
          data = JSON.stringify(data);
          console.log('Recieved button3:' + data);
          clients.forEach(function(client) {
            if (connection !== client) {
            client.send(data);
            }
          });
        }

        else if(data.value!='Addline' && data.value!='Delline' ){
          data.user = connection.remoteAddress;
          data = JSON.stringify(data);
          console.log('Received: ' + data);
          clients.forEach(function(client) {
            if (connection !== client) {
             client.send(data);
             } 
          }) 
        }
    });
  connection.on('close', function(reasonCode, description) {
    console.log('Disconnected ' + connection.remoteAddress);
  });
});
