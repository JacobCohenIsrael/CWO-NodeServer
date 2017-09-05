/**
 * @type Player
 */
class Player {
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
}

export default Player;
