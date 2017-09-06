import playerDb from "~/tempDb/playerDb";

import {CurrentStats, Stats} from "~/Ship/Stats/Stats";

class PlayerService {
    constructor(serviceManager) {
        this.playerAdapter = serviceManager.get('playerAdapter');
    }

	getPlayerByToken(token)
	{
		let player = null;
		if (playerDb.hasOwnProperty(token)) {
			player = this.playerAdapter.createPlayer(playerDb[token]);
		} else {
			player = this.playerAdapter.createNewPlayer(this.playerAdapter.playerIdCounter, token);
			playerDb[token] = player;
			this.playerAdapter.playerIdCounter++;
		}
		return player;
	}
}

export default PlayerService;