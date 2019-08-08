

const express = require('express')
const es = require('event-stream');
const { spawn, spawnSync } = require('child_process')

var dirty = require('dirty');
var db = dirty('user.db');
  
  
var net = require('net');

const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(function(req, res, next){
   var data = "";
   req.on('data', function(chunk){ data += chunk})
   req.on('end', function(){
       req.rawBody = data;
	   req.jsonBody = JSON.parse(data);
       next();
   })
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/rpc', async (req, response) => {
  //http://116.203.203.109:3000/rpc?ethereumAddress=0x123123&ethSign=0x123123&ethSign
  //где ethAddr = жфировский адрес чела в дапке
  //ethSign какоенить сообщение подписанное web3.signMessage по которому мы чела авторизуем
  
  //if (web3.ecrecover(req.rawBody) != req.ethereumAddress) throw;
  
  console.log("\r\n\r\n request from: "+req.query.ethereumAddress);
  
  //get асоцированый бим адрес
  var myBeamAddr = db.get('user_'+req.query.ethereumAddress+"_beamAddr"); 
	  
  if (req.jsonBody.method == "tx_send" && req.jsonBody.params.from != myBeamAddr) {
	response.send("Access denied or beam address was not created");
	return;
  }
	
  var client = new net.Socket();
	client.connect(20000, '127.0.0.1', function() {
		console.log('Connected');
		client.write(req.rawBody+ '\n');
	});

	var acc = '';

	client.on('data', function(data) {
		acc += data;
		
		// searching for \n symbol to find end of response
		if(data.indexOf('\n') != -1)
		{
			var res = JSON.parse(acc);
			
			
			if (req.jsonBody.method == "create_address") {
				//https://github.com/BeamMW/beam/wiki/Beam-wallet-protocol-API#create_address 
				//если создаем адрес, то присваиваем ему дополнительно eth ключ
				
				var createdBeamAddress = res.result; //тут будет новый аддрес
				console.log("created beam address "+req.ethereumAddress+" : "+createdBeamAddress);
				
				db.set('user_'+req.query.ethereumAddress, createdBeamAddress);
			}
			
			response.send(res);

			client.destroy(); // kill client after server's response
		}
	});

	client.on('close', function() {
		console.log('Connection closed');
	});
 
})


app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
