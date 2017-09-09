/**
 * @type PlayerModel
 */
class PlayerModel {
    /**
     * @param {number} id
     * @param {string} firstName
     * @param {string} currentNodeName
     * @param {Boolean} isLanded
     * @param {string} homePlanetName
     * @param {number} credits
     * @param {number} activeShipIndex
     * @param {string} token
     * @param {Ship[]} ships
     */
    constructor (id, firstName, currentNodeName, isLanded, homePlanetName, credits, activeShipIndex, token, ships) {
        this.id = id;
        this.firstName = firstName;
        this.currentNodeName = currentNodeName;
        this.isLanded = isLanded;
        this.homePlanetName = homePlanetName;
        this.credits = credits;
        this.activeShipIndex = activeShipIndex;
        this.token = token;
        this.ships = ships;
    }

    getActiveShip() {
        return this.ships[this.activeShipIndex];
    }

	static buildPlayer(player) {
		console.log("Building Player", player);
		return new PlayerModel(player.id, player.firstName, player.currentNodeName, player.isLanded, player.homePlanetName, player.credits, player.activeShipIndex, player.token, player.ships);
	}
}

export default PlayerModel;
