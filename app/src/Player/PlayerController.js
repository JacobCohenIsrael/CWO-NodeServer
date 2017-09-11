import SocketIOService from "~/Network/SocketIOService";

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
}

export default PlayerController;