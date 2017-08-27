module.exports = class Player {
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
};