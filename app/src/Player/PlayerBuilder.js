import Player from "~/Player/Player";
import Part from "~/Ship/Part/Part";
import shipDb from "~/tempDB/shipDb";
import Ship from "~/Ship/Ship";
import {CurrentStats, Stats} from "~/Ship/Stats/Stats";

class PlayerBuilder {
    constructor()
    {

    }

    /**
     * @param {string | number} id
     * @param {string} token
     * @returns {Player}
     */
    createNewPlayer(id, token) {
        console.log("Creating new player", id, token)
        const parts = [
            new Part('BasicEngine', {
                "jumpRange": 10
            }),
            new Part('BasicCargo', {
                "cargoCapacity": 50
            }),
            new Part('BasicEnergyGenerator', {
                "energyRegen": 2,
                "energyCapacity": 10
            })
        ];

        const defaultShipStats = shipDb.Ancients.Jumper;
        const defaultBaseStats = defaultShipStats.baseStats;
        const stats = new Stats(defaultBaseStats.hull, defaultBaseStats.shieldRegen, defaultBaseStats.shieldCapacity, defaultBaseStats.energyRegen,
            defaultBaseStats.energyCapacity, defaultBaseStats.jumpRange, defaultBaseStats.cargoCapacity);
        const defaultShipSlots = defaultShipStats.slots;
        const defaultShip = new Ship(stats, new CurrentStats(), "Jumper", "Ancients", parts, {}, defaultShipSlots);
        const ships = [defaultShip];
        return new Player(id, "Guest" + id, "Earth", true, "Earth", 1000, 0, token, ships);
    }

    createPlayer(player)
    {
        console.log("Creating Player", player);
        return new Player(player.id, player.firstName, player.currentNodeName, player.isLanded, player.homePlanetName, player.credits, player.activeShipIndex, player.token, player.ships);
    }
}

export default PlayerBuilder;