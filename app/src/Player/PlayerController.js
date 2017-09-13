import SocketIOService from "/Network/SocketIOService";

class PlayerController
{
	/**
	 *
	 * @param {ServiceManager} serviceManager
	 */
	constructor(serviceManager) {
		this.playerService = serviceManager.getPlayerService();
		this.eventManager = serviceManager.getEventManager();
		this.nodeService = serviceManager.getNodeService();
		this.notificationService = serviceManager.getNotificationService();
		this.socketIOService = serviceManager.get(SocketIOService);
	}

	/**
	 * @param {Socket} socket
	 * @param {PlayerModel} player
	 */
	landPlayerOnStar(socket, player) {
        this.playerService.landPlayerOnStar(player.id);
        this.nodeService.removeShipFromNode(player.currentNodeName, player.id);
		socket.emit('playerLanded', { player: player });
		socket.io.to('node' + player.currentNodeName).emit('shipLeftNode', { playerId: player.id });
		this.socketIOService.leaveRoom('node' + player.currentNodeName, socket);
    }

    /**
     * @param {Socket} socket
     * @param {PlayerModel} player
     */
	departPlayerFromStar(socket, player) {
		this.playerService.departPlayerFromStar(player.id);
		this.nodeService.addShipToNode(player.currentNodeName, player.id, player.getActiveShip());
		socket.emit('playerDeparted' , { player: player, node: this.nodeService.nodes[player.currentNodeName] });
		socket.io.to('node' + player.currentNodeName).emit('shipEnteredNode', { ship: player.getActiveShip(), playerId: player.id });
		this.socketIOService.joinRoom('node' + player.currentNodeName, socket);
    }

	playerLeftLounge(socket, player) {
        this.socketIOService.leaveRoom('lounge' + player.currentNodeName, socket);
        socket.emit('playerLeftLounge', { player: player });
    }

	playerEnteredLounge(socket, player) {
        this.socketIOService.joinRoom('lounge' + player.currentNodeName, socket);
        socket.emit('playerEnteredLounge', { player: player });
    }

	playerEnteredMarket(socket, player) {
        socket.emit('playerEnteredMarket', {
            player: player,
            resourceSlotList: this.nodeService.nodes[player.currentNodeName].market.resourceList
        });
        this.socketIOService.joinRoom('market' + player.currentNodeName, socket);
    }

	playerLeftMarket(socket, player) {
		socket.emit('playerLeftMarket', {
			player: player
		});
		this.socketIOService.leaveRoom('market' + player.currentNodeName, socket);
	}

    jumpPlayerToNode(socket, jumpingPlayer, node) {
        //console.log("Jumping player " + data.player.id + " From Node " + data.player.currentNodeName + " To Node " + data.node.name);
        if (jumpingPlayer.currentNodeName === node.name) {
            console.log("WTF player is trying to jump to the node he's at?");
            return;
        }
        const currentNode = this.nodeService.nodes[jumpingPlayer.currentNodeName];
        const destinationNode = this.nodeService.nodes[node.name];
        if (!currentNode.connectedNodes[destinationNode.name]) {
            this.notificationService.sendNotification("Nodes are not connected!");
            return;
        }
        let shipJumpRange = jumpingPlayer.getActiveShip().maxStats.jumpRange;
        let destinationNodeJumpRange = currentNode.connectedNodes[destinationNode.name].jumpRange;
        if (shipJumpRange < destinationNodeJumpRange) {
            this.notificationService.sendNotification("Engines are not strong enough to jump there!");
            return
        }
        this.socketIOService.leaveRoom('node' + jumpingPlayer.currentNodeName, socket);
        socket.io.to('node' + jumpingPlayer.currentNodeName).emit('shipLeftNode', { playerId: jumpingPlayer.id });
        delete this.nodeService.nodes[jumpingPlayer.currentNodeName].ships[jumpingPlayer.id];
        jumpingPlayer.currentNodeName = node.name;
        socket.io.to('node' + jumpingPlayer.currentNodeName).emit('shipEnteredNode', { ship: jumpingPlayer.ships[jumpingPlayer.activeShipIndex], playerId: jumpingPlayer.id });
        socket.emit('playerJumpedToNode', { player: jumpingPlayer, node: this.nodeService.nodes[jumpingPlayer.currentNodeName] });
        this.nodeService.nodes[jumpingPlayer.currentNodeName].ships[jumpingPlayer.id] = jumpingPlayer.ships[jumpingPlayer.activeShipIndex];
        this.socketIOService.joinRoom('node' + jumpingPlayer.currentNodeName, socket);
    }
}

export default PlayerController;