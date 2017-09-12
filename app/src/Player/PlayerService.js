class PlayerService {

	/**
	 * @param {ServiceManager} serviceManager
	 */
    constructor(serviceManager) {
        this.playerAdapter = serviceManager.getPlayerAdapter();
        this.notificationService = serviceManager.getNotificationService();
    }

	getPlayerByToken(token) {
		return this.playerAdapter.getPlayerByToken(token)
	}

	getOnlinePlayer(socket, playerId, playerToken) {
    	if (!this.playerAdapter.players[playerId] || !this.playerAdapter.players[playerId].token === playerToken) {
    		this.notificationService.sendNotification(socket, "Invalid Player", playerId, playerToken);
    		return;
		}
		return this.playerAdapter.players[playerId];
	}

	landPlayerOnStar(playerId) {
    	if (!this.playerAdapter.players[playerId]) {
    		console.log(`Player ${playerId} is not online!`);
    		return;
		}
		const player = this.playerAdapter.players[playerId];
    	player.isLanded = true;
	}

	departPlayerFromStar(playerId) {
		if (!this.playerAdapter.players[playerId]) {
			console.log(`Player ${playerId} is not online!`);
			return;
		}
		const player = this.playerAdapter.players[playerId];
		player.isLanded = false;
	}
}

export default PlayerService;