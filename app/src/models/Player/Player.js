
import Ship from "../Ship/Ship";
import {CurrentStats, Stats} from "../Ship/Stats/Stats";
import Part from "../Ship/Part/Part";

/**
 * @type Player
 */
class Player {
    /**
     * @param id
     * @param {string} firstName
     * @param {string} currentNodeName
     * @param {Boolean} isLanded
     * @param {string} homePlanetName
     * @param {number} credits
     * @param {number} activeShipIndex
     * @param token
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
}

export default Player;


export class PlayerBuilder {
    /**
     * @param {string | number} id
     * @param {string} token
     * @returns {Player}
     */
    static createNewPlayer(id, token) {
        const parts = [
            new Part('BasicEngine', {
                "cargoCapacity": 50
            }),
            new Part('BasicCargo', {
                "cargoCapacity": 50
            }),
            new Part('BasicGenerator', {
                "energyRegen": 2,
                "energyCapacity": 10
            })
        ];
        // const defaultShip = new Ship(1, 1, 1, 1, 0, "jumper", "Ancients", {}, parts);
        const defaultShip = new Ship(new Stats(), new CurrentStats(), "Jumper", "Ancients", parts);
        const ships = [defaultShip];
        return new Player(id, "Guest" + id, "Earth", true, "Earth", 1000, 0, token, ships);
    }
}
