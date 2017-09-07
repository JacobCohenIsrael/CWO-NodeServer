import socket from 'socket.io';
import http from 'http';
import ServerConfiguration from '~/Config/app.configurations';
import NodeService from "~/Node/NodeService";
import LoginController from '~/Login/LoginController';
import ServiceManager from "~/Service/ServiceManager";

const server = http.Server(ServerConfiguration.app);
const io = socket(server);
const serviceManager = new ServiceManager();
const playerAdapter = serviceManager.getPlayerAdapter();
const nodeService = serviceManager.get(NodeService);
let routes = {
	"login" : {
		"controller" : LoginController,
		"action" : "login"
	}
			
};

let controllers = {};

const eventManager = serviceManager.getEventManager();

//let logInterval = setInterval(logStuff, 3000);

//let marketPriceChangeInterval = setInterval(adjustMarketPrices, 1000*3);

function adjustMarketPrices()
{
	eventManager.dispatch("adjustMarketPrices");
    for (let nodeName in nodeService.nodes)
    {
        if (nodeService.nodes[nodeName].hasOwnProperty('market') && nodeName !== "Siera") {
            const resourceList = nodeService.nodes[nodeName].market.resourceList;
            for (let resourceName in resourceList) {
                console.log(`${nodeName} - ${resourceName}`);
                console.log(resourceList[resourceName]);
                const resource = resourceList[resourceName];
                console.log("buy - sell", resource.boughtAmount - resource.soldAmount);
                console.log("normalize", 100 * (playerAdapter.onlinePlayers + 1) * (resource.buyPrice - resource.sellPrice));
                console.log("overall", (resource.boughtAmount - resource.soldAmount) / ( 100 * (playerAdapter.onlinePlayers + 1) * (resource.buyPrice - resource.sellPrice)));
                let newPriceDelta = (resource.boughtAmount - resource.soldAmount) / ( 100 * (playerAdapter.onlinePlayers + 1) * (resource.buyPrice - resource.sellPrice) );
				if (newPriceDelta > 0) {
					newPriceDelta = Math.floor(newPriceDelta);
				} else {
					newPriceDelta = Math.ceil(newPriceDelta);
				}
				console.log("delta: ", newPriceDelta);
                if (newPriceDelta !== 0) {
                    resource.buyPrice += newPriceDelta;
                    resource.sellPrice = Math.floor(0.7*resource.buyPrice);
                    resource.boughtAmount = 0;
                    resource.soldAmount = 0;
                    io.to('market' + nodeName).emit('resourcePriceChanged', { resource: resource });
                }
            }
        }
    }
}
io.on('connection', function (socket) {

	socket.use(function(packet, next) {
		let eventName = packet[0];
		if (!routes.hasOwnProperty(eventName)) {
			next();
			return;
		}
		let data = packet[1];
		const router = routes[eventName];
		let controller = null;
		if (!controllers[router["controller"].constructor.name]) {
			controller = new router["controller"](serviceManager);
			controllers[controller.constructor.name] = controller;
		} else {
			controller = controllers[router["controller"].name]
		}
		
		let action = router["action"];
		let args = [socket];
		for (let key in data)
        {
            args.push(data[key]);
        }
		controller[action](...args);
	});

    console.log('Connecting Established');
    socket.emit('connectionResponse', { 'success': true });

    socket.on('landPlayerOnStar', function (data) {
        //console.log("Landing player " + data.id + " On Star");
        validatePlayerRequest(data.player);
        const player = playerAdapter.players[data.player.id];
        playerAdapter.players[player.id].isLanded = true;
        leaveRoom('node' + player.currentNodeName);
        io.to('node' + player.currentNodeName).emit('shipLeftNode', { playerId: player.id });
        socket.emit('playerLanded', { player: player });
        nodeService.removeShipFromNode(player.currentNodeName, player.id);
    });

    socket.on('departPlayerFromStar', function (data) {
        validatePlayerRequest(data.player);
        playerAdapter.players[data.player.id].isLanded = false;
        io.to('node' + data.player.currentNodeName).emit('shipEnteredNode', { ship: data.player.ships[data.player.activeShipIndex], playerId: data.player.id });
        socket.emit('playerDeparted', { 'success': true, player: playerAdapter.players[data.player.id], node: nodeService.nodes[data.player.currentNodeName] });
        nodeService.nodes[data.player.currentNodeName].ships[data.player.id] = data.player.ships[data.player.activeShipIndex];
        joinRoom('node' + data.player.currentNodeName);
    });

    socket.on('playerEnteredLounge', function (data) {
        validatePlayerRequest(data.player);
        joinRoom('lounge' + data.player.currentNodeName);
        socket.emit('playerEnteredLounge', { 'success': true, player: playerAdapter.players[data.id] });
    });

    socket.on('playerEnteredMarket', function (data) {
        const player = data.player;
        validatePlayerRequest(player);
        socket.emit('playerEnteredMarket', {
            player: playerAdapter.players[player.id],
            resourceSlotList: nodeService.nodes[player.currentNodeName].market.resourceList
        });
        joinRoom('market' + data.player.currentNodeName);
    });

	socket.on('playerLeftMarket', function (data) {
        const player = data.player;
        validatePlayerRequest(player);
        socket.emit('playerLeftMarket', {
            player: playerAdapter.players[player.id]
        });
        leaveRoom('market' + data.player.currentNodeName);
    });

    socket.on('playerLeftLounge', function (data) {
        validatePlayerRequest(data.player);
        leaveRoom('lounge' + data.player.currentNodeName);
        socket.emit('playerLeftLounge', { 'success': true, player: playerAdapter.players[data.id] });
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
        const player = playerAdapter.players[data.player.id];
        const resourceList = nodeService.nodes[player.currentNodeName].market.resourceList;
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

        player.credits -= totalPrice;
        if (!player.getActiveShip().shipCargo.hasOwnProperty(data.resource.name)) {
            player.getActiveShip().shipCargo[data.resource.name] = 0;
        }
        player.getActiveShip().shipCargo[data.resource.name] += data.resource.amount;
        nodeService.nodes[player.currentNodeName].market.resourceList[data.resource.name].boughtAmount += data.resource.amount;
        player.getActiveShip().currentStats.cargo -= data.resource.amount;
        socket.emit('playerBoughtResource', { 'success': true, player: player });
    });

    socket.on('playerSellResource', function (data) {
        validatePlayerRequest(data.player);
        const player = playerAdapter.players[data.player.id];
        if (!player.getActiveShip().shipCargo.hasOwnProperty([data.resource.name])) {
            sendNotification("Player does not have this resource");
            return;
        }
        if (!player.getActiveShip().shipCargo[data.resource.name] >= data.resource.amount) {
            sendNotification("Player does not have that amount of resource to sell");
            return;
        }
        const resourceList = nodeService.nodes[player.currentNodeName].market.resourceList;
        let totalPrice = resourceList[data.resource.name].sellPrice * data.resource.amount;
        player.credits += totalPrice;
        player.getActiveShip().shipCargo[data.resource.name] -= data.resource.amount;
        nodeService.nodes[player.currentNodeName].market.resourceList[data.resource.name].soldAmount += data.resource.amount;
        player.getActiveShip().currentStats.cargo += data.resource.amount;
        socket.emit('playerSoldResource', { 'success': true, player: playerAdapter.players[data.player.id] });
    });

    socket.on('jumpPlayerToNode', function (data) {
        //console.log("Jumping player " + data.player.id + " From Node " + data.player.currentNodeName + " To Node " + data.node.name);
        validatePlayerRequest(data.player);
        const jumpingPlayer = playerAdapter.players[data.player.id];
        if (jumpingPlayer.currentNodeName == data.node.name) {
            console.log("WTF player is trying to jump to the star he's at?");
            return;
        }
        const currentNode = nodeService.nodes[jumpingPlayer.currentNodeName];
        const destinationNode = nodeService.nodes[data.node.name];
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
        delete nodeService.nodes[jumpingPlayer.currentNodeName].ships[data.player.id];
        playerAdapter.players[jumpingPlayer.id].currentNodeName = jumpingPlayer.currentNodeName = data.node.name;
        io.to('node' + jumpingPlayer.currentNodeName).emit('shipEnteredNode', { ship: jumpingPlayer.ships[jumpingPlayer.activeShipIndex], playerId: jumpingPlayer.id });
        socket.emit('playerJumpedToNode', { player: jumpingPlayer, node: nodeService.nodes[jumpingPlayer.currentNodeName] });
        nodeService.nodes[jumpingPlayer.currentNodeName].ships[jumpingPlayer.id] = jumpingPlayer.ships[jumpingPlayer.activeShipIndex];
        joinRoom('node' + jumpingPlayer.currentNodeName);
    });

    socket.on('disconnect', function (data) {
        console.log("disconnecting");
        eventManager.dispatch("playerDisconnect", socket);
    });

    function validatePlayerRequest(player) {
        if (playerAdapter.players[player.id].token === player.token) {
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
    for (let token in playerAdapter.players) {
        console.log("**************************** Player " + playerAdapter.players[token].id + " ****************************");
        console.log(playerAdapter.players[token]);
    }

    console.log("**************************** Stars ****************************");
    for (let nodeName in nodeService.nodes) {
        if (nodeName === "Earth") {
            console.log("**************************** Node " + nodeName + " ****************************");
            console.log(syntaxHighlight(nodeService.nodes[nodeName]));
        }
    }
}

function syntaxHighlight(json) {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return match;
    });
}

ServerConfiguration.initServer(server);