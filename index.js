const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const extend = require('util')._extend;
require('./config/app.configurations')(app);
const ModelsService = require('./src/models/ModelService');
const playersDb = require('./tempDB/playerDb.json');
const nodeDb = require('./tempDB/nodeDb.json');
const players = {};
const connectionsId = {};
const nodes = {};
const worldMap = {};
var idCounter = 2;
const {Player, Ship, Part} = ModelsService;
const parts = [
    new Part('BasicEngine', {
        "cargoCapacity": 50
    }),
    new Part('BasicCargo', {
        "cargoCapacity": 50
    }),
    new Part('BasicGenerator', {
        "energyRegen": 2,
        "energyCapacity": 10
    })
];
const ships = [new Ship(1,1,1,1,0,"jumper", "Ancients", {}, parts)];

initNodes();
require('./routes/routeManager')(app);
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.use(express.static('./'));
io.on('connection', function (socket) {
    console.log('Connectin Established');
    socket.emit('connectionResponse', { 'success': true });
    socket.on('login', function (data) {
        const token = data.request.token;
        let player = null;
        if (!playersDb.hasOwnProperty(token)) {
            console.log("Token is not detected", token);
            console.log("Creating New player with player ID", idCounter);
            player = new Player(idCounter, "Guest" + idCounter, "Earth", true, "Earth", 1000, 0, data.request.token, ships);
            playersDb[token] = player;
            idCounter++;
        } else {
            player = playersDb[token];
        }
        console.log("Player Logged In", player);
        connectionsId[socket.id] = player.id;
        player.ships[0].cachedShipStats = {
            "hull": 50,
            "cargoCapacity": 50,
            "jumpRange": 20,
            "energyRegen": 2,
            "energyCapacity": 10
        };

        players[player.id] = player;
        socket.emit('loginResponse', {
            player: player
        });
    });

    socket.on('landPlayerOnStar', function (data) {
        //console.log("Landing player " + data.id + " On Star");
        validatePlayerRequest(data.player);
        const player = players[data.player.id];
        players[player.id].isLanded = true;
        leaveRoom('node-' + player.currentNodeName);
        io.to('node-' + player.currentNodeName).emit('shipLeftNode', { playerId: player.id });
        socket.emit('playerLanded', { player: player });
        delete nodes[player.currentNodeName].ships[player.id];
    });

    socket.on('departPlayerFromStar', function (data) {
        validatePlayerRequest(data.player);
        players[data.player.id].isLanded = false;
        io.to('node-' + data.player.currentNodeName).emit('shipEnteredNode', { ship: data.player.ships[data.player.activeShipIndex], playerId: data.player.id });
        socket.emit('playerDeparted', { 'success': true, player: players[data.player.id], node: nodes[data.player.currentNodeName] });
        nodes[data.player.currentNodeName].ships[data.player.id] = data.player.ships[data.player.activeShipIndex];
        joinRoom('node-' + data.player.currentNodeName);
    });

    socket.on('playerEnteredLounge', function (data) {
        validatePlayerRequest(data.player);
        joinRoom('lounge' + data.player.currentNodeName);
        socket.emit('playerEnteredLounge', { 'success': true, player: players[data.id] });
    });

    socket.on('playerEnterMarket', function (data) {
        //console.log("Player " + data.player.id + " Entered Lounge");
        const player = data.player;
        validatePlayerRequest(player);
        socket.emit('playerEnteredMarket', {
            player: players[player.id],
            resourceSlotList: nodes[player.currentNodeName].market.resourceList
        });
        joinRoom('market' + data.player.currentNodeName);
    });

    socket.on('playerLeftLounge', function (data) {
        validatePlayerRequest(data.player);
        leaveRoom('lounge' + data.player.currentNodeName);
        socket.emit('playerLeftLounge', { 'success': true, player: players[data.id] });
    });

    socket.on('chatSent', (data) => {
        //console.log("Player " + data.player.id + " Sent Chat", data);
        //console.log("Sending message " + data.message.message + " to room '" + data.message.roomKey + data.player.currentNodeName + "' with sender Id " + data.player.id + " with name '" + data.player.firstName + "'");
        io.to(data.message.roomKey + data.player.currentNodeName).emit('chatMessageReceived', { senderId: data.player.id, senderName: data.player.firstName, receivedMessage: data.message.message });
    });

    socket.on('playerBuyResource', function (data) {
        //console.log("Player is buying resource ", data);

        const player = data.player;
        validatePlayerRequest(player);
        const resourceList = nodes[player.currentNodeName].market.resourceList;
        if (!resourceList.hasOwnProperty(data.resource.name)) {
			sendNotification("This star does not contain this resource");
            return;
        }
        if (players[data.player.id].credits < resourceList[data.resource.name].buyPrice) {
            sendNotification("Player does not have enough credits to purchase this resource");
            return;
        }

        resourceList[data.resource.name].amount -= data.resource.amount;
        players[data.player.id].credits -= resourceList[data.resource.name].buyPrice;
        if (!players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo.hasOwnProperty(data.resource.name)) {
            players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo[data.resource.name] = 0;
        }
        players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo[data.resource.name] += data.resource.amount;
		nodes[player.currentNodeName].market.resourceList[data.resource.name].boughtAmount += data.resource.amount;
        socket.emit('playerBoughtResource', { 'success': true, player: players[data.player.id] });
    });

    socket.on('playerSellResource', function (data) {
        const player = data.player;
        if (!players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo.hasOwnProperty([data.resource.name])) {
            sendNotification("Player does not have this resource");
            return;
        }
        if (!players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo[data.resource.name] >= data.resource.amount) {
            sendNotification("Player does not have that amount of resource to sell");
            return;
        }
        const resourceList = nodes[player.currentNodeName].market.resourceList;
        resourceList[data.resource.name].amount += data.resource.amount;
        players[data.player.id].credits += resourceList[data.resource.name].sellPrice;
        players[data.player.id].ships[players[data.player.id].activeShipIndex].shipCargo[data.resource.name] -= data.resource.amount;
		nodes[player.currentNodeName].market.resourceList[data.resource.name].soldAmount += data.resource.amount;
        socket.emit('playerSoldResource', { 'success': true, player: players[data.player.id] });
    });

    socket.on('jumpPlayerToNode', function (data) {
        //console.log("Jumping player " + data.player.id + " From Node " + data.player.currentNodeName + " To Node " + data.node.name);
        validatePlayerRequest(data.player);
        const jumpingPlayer = players[data.player.id];
        if (jumpingPlayer.currentNodeName == data.node.name) {
			console.log("WTF player is trying to jump to the star he's at?");
			return;
		}
        const currentNode = nodes[jumpingPlayer.currentNodeName];
        const destinationNode = nodes[data.node.name];
        if (!currentNode.connectedNodes.hasOwnProperty(destinationNode.name)) {
            sendNotification("Nodes are not connected!");
			return;
        }
        let shipJumpRange = jumpingPlayer.ships[jumpingPlayer.activeShipIndex].cachedShipStats.jumpRange;
        let destinationNodeJumpRange = currentNode.connectedNodes[destinationNode.name].jumpRange;
        if (shipJumpRange < destinationNodeJumpRange) {
			sendNotification("Engines are not strong enough to jump there!");
			return
		}
        leaveRoom('node-' + jumpingPlayer.currentNodeName);
        io.to('node-' + jumpingPlayer.currentNodeName).emit('shipLeftNode', { playerId: jumpingPlayer.id });
        delete nodes[jumpingPlayer.currentNodeName].ships[data.player.id];
        players[jumpingPlayer.id].currentNodeName = jumpingPlayer.currentNodeName = data.node.name;
        io.to('node-' + jumpingPlayer.currentNodeName).emit('shipEnteredNode', { ship: jumpingPlayer.ships[jumpingPlayer.activeShipIndex], playerId: jumpingPlayer.id });
        socket.emit('playerJumpedToNode', { player: jumpingPlayer, node: nodes[jumpingPlayer.currentNodeName] });
        nodes[jumpingPlayer.currentNodeName].ships[jumpingPlayer.id] = jumpingPlayer.ships[jumpingPlayer.activeShipIndex];
        joinRoom('node-' + jumpingPlayer.currentNodeName);
    });

    socket.on('getWorldMapNodes', function(data) {
        const player = players[connectionsId[socket.id]];
        socket.emit('worldMapNodesReceived', { worldMapNodes : worldMap, player : player, currentNode : nodes[player.currentNodeName] });
    });

    // socket.on('disconnect', function (data) {
    //     const player = players[connectionsId[socket.id]];
    //     const currentNode = nodes[player.currentNodeName];
    //     if (currentNode.hasOwnProperty('star') && !player.isLanded) {
    //         player.isLanded = true;
    //         io.to('node-' + player.currentNodeName).emit('shipLeftNode', { playerId: player.id });
	// 		delete nodes[player.currentNodeName].ships[player.id];
    //         delete player[player.id];
    //     }
    //     playersDb[player.id] = player;
    //     delete connectionsId[socket.id];
    // });

    function validatePlayerRequest(player) {
        if (players[player.id].token === player.token) {
            socket.emit('invalidToken', {});
        }
    }

    function joinRoom(roomName)
    {
        if (!socket.rooms.hasOwnProperty(roomName)) {
            socket.join(roomName);
        }
    }

    function leaveRoom(roomName)
    {
        if (socket.rooms.hasOwnProperty(roomName)) {
            socket.leave(roomName);
        }
    }

	function sendNotification(msg)
	{
		socket.emit('notificationReceived', { notificationText: msg });
	}
});


function logStuff() {
    console.log("**************************** Players ****************************");
    for (var playerId in players) {
        console.log("**************************** Player " + playerId + " ****************************");
        console.log(players[playerId]);
    }

    console.log("**************************** Stars ****************************");
    for (var starName in nodeDb) {
        console.log("**************************** Star " + starName + " ****************************");
        console.log(nodeDb[starName]);
    }
}

function initNodes() {
    for (let nodeName in nodeDb) {
        let node = nodeDb[nodeName];
        nodes[nodeName] = node;
        worldMap[nodeName] = {
            name: node.name,
            coordX: node.coordX,
            coordY: node.coordY,
            sprite: node.sprite,
            connectedNodes: node.connectedNodes
        }
        if (node.hasOwnProperty('star')) {
            worldMap[nodeName].star = node.star;
        }
    }
    //console.log(nodes);
}

server.listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});