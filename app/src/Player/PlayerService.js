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
}

export default PlayerService;