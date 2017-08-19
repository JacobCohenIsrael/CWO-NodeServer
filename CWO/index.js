const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./config/app.configurations')(app);
const playersDb = require('./tempDB/playerDb.json');
const nodeDb = require('./tempDB/nodeDb.json');
const players = {};
const nodes = {};

let idCounter = 2;
const newPlayer = {
    id : idCounter,
	firstName : "Smith",
	currentNodeName : "TestStar",
	isLanded : true,
	homePlanetId : "TestStar",
	credits : 10,
	activeShipIndex : 0,
	sessionId : "3adasd2ds-63af-408b-9ce2-931631c0bbed",
	ships : [
		{
			id : 1,
			currentHullAmount: 1,
			currentShieldAmount : 1,
            currentEnergyAmount : 1,
            shipClass: "jumper",
            shipType: "Ancients",
			shipCargo : {},
			shipParts : [
				{
					"name": "BasicEngine",
					"partStats" : {
						"hull": 50,
						"jumpDistance" : 10
					}
				},
				{
					"name": "BasicCargo",
					"partStats" : {
						"cargoCapacity": 50
					}
				},
				{
					"name": "BasicGenerator",
					"partStats" : {
						"energyRegen": 2,
						"energyCapacity": 10
					}
				}
			]
		}
	]
};
initNodes();

// let eventMethods = require('./socket/connection/socket.connection');
io.on('connection', function(socket) {
    //console.log('Connectin Established');
    // eventMethods = eventMethods(socket,idCounter, players, newPlayer);
    socket.emit('connectionResponse', {'success' : true });
    socket.on('login', function login(data) {
        if (!playersDb.hasOwnProperty(data.player.sessionId))
            {
                playersDb[data.player.sessionId] = newPlayer;
                idCounter++;
            }
            const player = playersDb[data.player.sessionId];
            player.ships[0].cachedShipStats = {
                "hull" : 50,
                "cargoCapacity": 50,
                "jumpDistance": 10,
                "energyRegen": 2,
                "energyCapacity": 10
            };
            players[player.id] = player;
            socket.emit('loginResponse', {'success' : true, player : player, starsList : nodeDb });
    });

    socket.on('landPlayerOnStar', function(data) {
        //console.log("Landing player " + data.id + " On Star");
        players[data.id].isLanded = true;
		socket.leave('node-' + players[data.id].currentNodeName);
		io.to('node-' + players[data.id].currentNodeName).emit('shipLeftNode', { playerId : data.id });	
        socket.emit('playerLanded', {'success' : true, player : players[data.id] });
		//console.log(nodes);
		delete nodes[players[data.id].currentNodeName].ships[data.id];
    });

    socket.on('departPlayerFromStar', function(data) {
        //console.log("Departing player " + data.player.id + " From Star");
        players[data.player.id].isLanded = false;
		io.to('node-' + data.player.currentNodeName).emit('shipEnteredNode', { ship : data.player.ships[data.player.activeShipIndex], playerId : data.player.id });		
        socket.emit('playerDeparted', {'success' : true, player : players[data.player.id], node: nodes[data.player.currentNodeName] });	
		nodes[data.player.currentNodeName].ships[data.player.id] = data.player.ships[data.player.activeShipIndex];
		socket.join('node-' + data.player.currentNodeName);
    });

	socket.on('playerEnteredLounge', function(data) {
        //console.log("Player " + data.player.id + " Entered Lounge");
		socket.join('lounge' + data.player.currentNodeName);
        socket.emit('playerEnteredLounge', {'success' : true, player : players[data.id] });
    });

	socket.on('playerLeftLounge', function(data) {
        //console.log("Player " + data.player.id + " Left Lounge");
		socket.leave('lounge' + data.player.currentNodeName);
        socket.emit('playerLeftLounge', {'success' : true, player : players[data.id] });
    });

	socket.on('chatSent', (data) => {
        //console.log("Player " + data.player.id + " Sent Chat", data);
		//console.log("Sending message " + data.message.message + " to room '" + data.message.roomKey + data.player.currentNodeName + "' with sender Id " + data.player.id + " with name '" + data.player.firstName + "'");
		io.to(data.message.roomKey + data.player.currentNodeName).emit('chatMessageReceived', { senderId: data.player.id, senderName: data.player.firstName, receivedMessage: data.message.message });
    });

    socket.on('playerBuyResource', function(data) {
        console.log("Player is buying resource ", data);
        if (!nodeDb[data.player.currentNodeName].resourceList.hasOwnProperty([data.resource.name])) {
            //console.log("This star does not contain this resource");
            return;
        }
        if (nodeDb[data.player.currentNodeName].resourceList[data.resource.name].amount < data.resource.amount) {
            //console.log("This star does not have this much resources to sell");
            return;
        }
        if (players[data.player.id].credits < nodeDb[data.player.currentNodeName].resourceList[data.resource.name].buyPrice) {
            //console.log("Player does not have enough credits to purchase this resource");
            return;
        }

        nodeDb[data.player.currentNodeName].resourceList[data.resource.name].amount -= data.resource.amount;
        players[data.player.id].credits -= nodeDb[data.player.currentNodeName].resourceList[data.resource.name].buyPrice;
        if (!players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo.hasOwnProperty(data.resource.name)) {
            players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo[data.resource.name] = 0;
        }
        players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo[data.resource.name] += data.resource.amount;
        socket.emit('playerBoughtResource', {'success' : true, player : players[data.player.id]});
        io.sockets.emit('updateResourceAmount', {
            'success' : true,
            starName: data.player.currentNodeName,
            resourceName: data.resource.name,
            newAmount : nodeDb[data.player.currentNodeName].resourceList[data.resource.name].amount });
    });

    socket.on('playerSellResource', function(data) {
        console.log("Player is selling resource ", data);
        if (!players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo.hasOwnProperty([data.resource.name])) {
            //console.log("Player does not have this resource");
            return;
        }
        if (!players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo[data.resource.name] >= data.resource.amount) {
            //console.log("Player does not have that amount of resource to sell");
            //console.log("Player Cargo: ", players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo);
            return;
        }

        nodeDb[data.player.currentNodeName].resourceList[data.resource.name].amount += data.resource.amount;
        players[data.player.id].credits += nodeDb[data.player.currentNodeName].resourceList[data.resource.name].sellPrice;
        players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo[data.resource.name] -= data.resource.amount;
        socket.emit('playerSoldResource', {'success' : true, player : players[data.player.id]});
        io.sockets.emit('updateResourceAmount', {
            'success' : true,
            starName: data.player.currentNodeName,
            resourceName: data.resource.name,
            newAmount : nodeDb[data.player.currentNodeName].resourceList[data.resource.name].amount
        });
    });

    socket.on('jumpPlayerToStar', function(data) {
        console.log(data);
        console.log("Jumping player " + data.player.id + " From Star " + data.player.currentNodeName + " To Star " + data.star.name);
        if (players[data.player.id].currentNodeName != data.star.name )
        {
			let jumpingPlayer = data.player;
			socket.leave('node-' + jumpingPlayer.currentNodeName);
			io.to('node-' + jumpingPlayer.currentNodeName).emit('shipLeftNode', { playerId : jumpingPlayer.id });
			delete nodes[jumpingPlayer.currentNodeName].ships[data.player.id];
            players[jumpingPlayer.id].currentNodeName = jumpingPlayer.currentNodeName =  data.star.name;
			io.to('node-' + jumpingPlayer.currentNodeName).emit('shipEnteredNode', { ship : jumpingPlayer.ships[jumpingPlayer.activeShipIndex], playerId : jumpingPlayer.id });	
			socket.emit('playerDeparted', {'success' : true, player : jumpingPlayer, node: nodes[jumpingPlayer.currentNodeName] });	
			nodes[jumpingPlayer.currentNodeName].ships[jumpingPlayer.id] = jumpingPlayer.ships[jumpingPlayer.activeShipIndex];
			socket.join('node-' + jumpingPlayer.currentNodeName);
        }
        else
        {
            console.log("WTF player is trying to jump to the star he's at?");
        }
        socket.emit('playerJumped', {'success' : true, player : players[data.player.id] });
    });

    socket.on('test', function(data) {
        console.log("Test: ", data);
    });

});

function logStuff()
{
    console.log("**************************** Players ****************************");
    for (var playerId in players)
    {
        console.log("**************************** Player " + playerId + " ****************************");
        console.log(players[playerId]);
    }

    console.log("**************************** Stars ****************************");
    for (var starName in nodeDb)
    {
        console.log("**************************** Star " + starName + " ****************************");
        console.log(nodeDb[starName]);
    }
}

function initNodes()
{
	for (let nodeName in nodeDb) {
		let node = nodeDb[nodeName];
		nodes[nodeName] = {
			ships : {}
		}
	}
}

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})