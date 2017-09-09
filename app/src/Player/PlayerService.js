class PlayerService {

	/**
	 * @param {ServiceManager} serviceManager
	 */
    constructor(serviceManager) {
        this.playerAdapter = serviceManager.getPlayerAdapter();
    }

	getPlayerByToken(token)
	{
		return this.playerAdapter.getPlayerByToken(token)
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