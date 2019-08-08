# beam-js-testnet
PoC of beam.js (createAddr, balance and send tx)

```pm2 start beamjs_service.js```

full api reference https://github.com/BeamMW/beam/wiki/Beam-wallet-protocol-API#create_address

# use on dAPP side
```
//create address
rpcRequest = 
{
	"jsonrpc":"2.0", 
	"id": 1,
	"method":"create_address", 
	"params":
	{
		"expiration": "24h"
	}
}
 
$.ajax({
type: "POST",
url: "http://116.203.203.109:3000/rpc?ethereumAddress="+web3.eth.address&sign="+web3.sign(rpcRequest),
 data: JSON.stringify(rpcRequest),
success: function(data)
{
     console.log(data);
}
});
```


try to send txid from address of incorrect user 
![](https://screenshots.wpmix.net/chrome_5PBv1XvEBsvGdmbktY0oRyGih35LCp2V.png)


TODO
close all other methods
