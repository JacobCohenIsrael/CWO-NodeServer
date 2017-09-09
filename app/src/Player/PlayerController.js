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
	}

	/**
	 *
	 * @param {PlayerModel} player
	 */
	landPlayerOnStar(player) {
        this.playerService.landPlayerOnStar(player.id);
        this.nodeService.removeShipFromNode(player.currentNodeName, player.id);

		const response = {
			emit: {
				eventName : 'playerLanded',
				eventData : {
					player: player
				}
			},
			to: {
				roomName : 'node' + player.currentNodeName,
				emit: {
					eventName : 'shipLeftNode',
					eventData : { playerId: player.id }
				}
			},
			leave: 'node' + player.currentNodeName
		};
		return response;
    }

	    departPlayerFromStar(player) {
			this.playerService.departPlayerFromStar(player.id);
			this.nodeService.addShipToNode(player.currentNodeName, player.id, player.getActiveShip());
			const response = {
				emit: {
					eventName : 'playerDeparted',
					eventData : { player: player, node: this.nodeService.nodes[player.currentNodeName] }
				},
				to: {
					roomName : 'node' + player.currentNodeName,
					emit: {
						eventName : 'shipEnteredNode',
						eventData : { ship: player.getActiveShip(), playerId: player.id }
					}
				},
				join: 'node' + player.currentNodeName
			};
			return response;
    }
}

export default PlayerController;