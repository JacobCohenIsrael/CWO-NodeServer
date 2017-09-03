import nodeDb from './tempDB/nodeDb';
import playersDb from './tempDB/playerDb';
import socket from 'socket.io';
import http from 'http';
import ServerConfiguration from './config/app.configurations';
import {PlayerBuilder} from "./src/models/Player/Player";
import NodesInitializer from "./src/Node";

const players = {};
const connectionsId = {};
let idCounter = 2;
const server = http.Server(ServerConfiguration.app);

const io = socket(server);

io.on('connection', function (socket) {
    console.log('Connecting Established');
    socket.emit('connectionResponse', { 'success': true });
    socket.on('login', function (data) {
        const token = data.request.token;
        let player = null;
        if (!playersDb.hasOwnProperty(token)) {
            player = PlayerBuilder.createNewPlayer(idCounter, token);
            playersDb[token] = player;
            idCounter++;
        } else {

            player = PlayerBuilder.createPlayer(playersDb[token]);
        }
        connectionsId[socket.id] = player.id;
        players[player.id] = player;
        socket.emit('loginResponse', {
            player: player,
            node: NodesInitializer.nodes[player.currentNodeName],
            worldMap: NodesInitializer.worldMap
        });
    });

    socket.on('landPlayerOnStar', function (data) {
        //console.log("Landing player " + data.id + " On Star");
        validatePlayerRequest(data.player);
        const player = players[data.player.id];
        players[player.id].isLanded = true;
        leaveRoom('node' + player.currentNodeName);
        io.to('node' + player.currentNodeName).emit('shipLeftNode', { playerId: player.id });
        socket.emit('playerLanded', { player: player });
        delete NodesInitializer.nodes[player.currentNodeName].ships[player.id];
    });

    socket.on('departPlayerFromStar', function (data) {
        validatePlayerRequest(data.player);
        players[data.player.id].isLanded = false;
        io.to('node' + data.player.currentNodeName).emit('shipEnteredNode', { ship: data.player.ships[data.player.activeShipIndex], playerId: data.player.id });
        socket.emit('playerDeparted', { 'success': true, player: players[data.player.id], node: NodesInitializer.nodes[data.player.currentNodeName] });
        NodesInitializer.nodes[data.player.currentNodeName].ships[data.player.id] = data.player.ships[data.player.activeShipIndex];
        joinRoom('node' + data.player.currentNodeName);
    });

    socket.on('playerEnteredLounge', function (data) {
        validatePlayerRequest(data.player);
        joinRoom('lounge' + data.player.currentNodeName);
        socket.emit('playerEnteredLounge', { 'success': true, player: players[data.id] });
    });

    socket.on('playerEnteredMarket', function (data) {
        const player = data.player;
        validatePlayerRequest(player);
        socket.emit('playerEnteredMarket', {
            player: players[player.id],
            resourceSlotList: NodesInitializer.nodes[player.currentNodeName].market.resourceList
        });
        joinRoom('market' + data.player.currentNodeName);
    });

	socket.on('playerLeftMarket', function (data) {
        const player = data.player;
        validatePlayerRequest(player);
        socket.emit('playerLeftMarket', {
            player: players[player.id]
        });
        leaveRoom('market' + data.player.currentNodeName);
    });

    socket.on('playerLeftLounge', function (data) {
        validatePlayerRequest(data.player);
        leaveRoom('lounge' + data.player.currentNodeName);
        socket.emit('playerLeftLounge', { 'success': true, player: players[data.id] });
    });

    socket.on('chatSent', (data) => {
        //console.log("Player " + data.player.id + " Sent Chat", data);
        //console.log("Sending message " + data.message.message + " to room '" + data.message.roomKey + data.player.currentNodeName + "' with sender Id " + data.player.id + " with name '" + data.player.firstName + "'");
        io
        .to(data.message.roomKey + data.player.currentNodeName)
        .emit('chatMessageReceived', { 
            senderId: data.player.id, 
            senderName: data.player.firstName, 
            receivedMessage: data.message.message,
            roomKey : data.roomKey 
        });
    });

    socket.on('playerBuyResource', function (data) {
        validatePlayerRequest(data.player);
        const player = players[data.player.id];
        const resourceList = NodesInitializer.nodes[player.currentNodeName].market.resourceList;
        if (!resourceList.hasOwnProperty(data.resource.name)) {
            sendNotification("This star does not contain this resource");
            return;
        }
        let totalPrice = resourceList[data.resource.name].buyPrice * data.resource.amount;
        if (player.credits < totalPrice) {
            sendNotification("You do not have enough credits to purchase this resource");
            return;
        }

        if (player.getActiveShip().currentStats.cargo < data.resource.amount) {
            sendNotification("Not enough space in cargo");
            return;
        }

        resourceList[data.resource.name].amount -= data.resource.amount;
        player.credits -= totalPrice;
        if (!player.getActiveShip().shipCargo.hasOwnProperty(data.resource.name)) {
            player.getActiveShip().shipCargo[data.resource.name] = 0;
        }
        player.getActiveShip().shipCargo[data.resource.name] += data.resource.amount;
        NodesInitializer.nodes[player.currentNodeName].market.resourceList[data.resource.name].boughtAmount += data.resource.amount;
        player.getActiveShip().currentStats.cargo -= data.resource.amount;
        socket.emit('playerBoughtResource', { 'success': true, player: player });
    });

    socket.on('playerSellResource', function (data) {
        validatePlayerRequest(data.player);
        const player = players[data.player.id];
        if (!player.getActiveShip().shipCargo.hasOwnProperty([data.resource.name])) {
            sendNotification("Player does not have this resource");
            return;
        }
        if (!player.getActiveShip().shipCargo[data.resource.name] >= data.resource.amount) {
            sendNotification("Player does not have that amount of resource to sell");
            return;
        }
        const resourceList = NodesInitializer.nodes[player.currentNodeName].market.resourceList;
        resourceList[data.resource.name].amount += data.resource.amount;
        let totalPrice = resourceList[data.resource.name].sellPrice * data.resource.amount;
        player.credits += totalPrice;
        player.getActiveShip().shipCargo[data.resource.name] -= data.resource.amount;
        NodesInitializer.nodes[player.currentNodeName].market.resourceList[data.resource.name].soldAmount += data.resource.amount;
        player.getActiveShip().currentStats.cargo += data.resource.amount;
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
        const currentNode = NodesInitializer.nodes[jumpingPlayer.currentNodeName];
        const destinationNode = NodesInitializer.nodes[data.node.name];
        if (!currentNode.connectedNodes.hasOwnProperty(destinationNode.name)) {
            sendNotification("Nodes are not connected!");
            return;
        }
        let shipJumpRange = jumpingPlayer.getActiveShip().maxStats.jumpRange;
        let destinationNodeJumpRange = currentNode.connectedNodes[destinationNode.name].jumpRange;
        if (shipJumpRange < destinationNodeJumpRange) {
            sendNotification("Engines are not strong enough to jump there!");
            return
        }
        leaveRoom('node' + jumpingPlayer.currentNodeName);
        io.to('node' + jumpingPlayer.currentNodeName).emit('shipLeftNode', { playerId: jumpingPlayer.id });
        delete NodesInitializer.nodes[jumpingPlayer.currentNodeName].ships[data.player.id];
        players[jumpingPlayer.id].currentNodeName = jumpingPlayer.currentNodeName = data.node.name;
        io.to('node' + jumpingPlayer.currentNodeName).emit('shipEnteredNode', { ship: jumpingPlayer.ships[jumpingPlayer.activeShipIndex], playerId: jumpingPlayer.id });
        socket.emit('playerJumpedToNode', { player: jumpingPlayer, node: NodesInitializer.nodes[jumpingPlayer.currentNodeName] });
        NodesInitializer.nodes[jumpingPlayer.currentNodeName].ships[jumpingPlayer.id] = jumpingPlayer.ships[jumpingPlayer.activeShipIndex];
        joinRoom('node' + jumpingPlayer.currentNodeName);
    });

    socket.on('disconnect', function (data) {
        const player = players[connectionsId[socket.id]];
        console.log("Disconnecting player", player.id);
        const currentNode = NodesInitializer.nodes[player.currentNodeName];
        if (currentNode.hasOwnProperty('star') && !player.isLanded) {
            player.isLanded = true;
            io.to('node' + player.currentNodeName).emit('shipLeftNode', { playerId: player.id });
            delete NodesInitializer.nodes[player.currentNodeName].ships[player.id];
            delete player[player.id];
        }
        playersDb[player.token] = player;
        delete connectionsId[socket.id];
    });

    function validatePlayerRequest(player) {
        if (players[player.id].token === player.token) {
            socket.emit('invalidToken', {});
        }
    }

    function joinRoom(roomName) {
        if (!socket.rooms.hasOwnProperty(roomName)) {
            socket.join(roomName);
        }
    }

    function leaveRoom(roomName) {
        if (socket.rooms.hasOwnProperty(roomName)) {
            socket.leave(roomName);
        }
    }

    function sendNotification(msg) {
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

ServerConfiguration.initServer(server);