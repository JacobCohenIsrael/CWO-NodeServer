import Part from "~/Ship/Part/Part";
import Ship from "~/Ship/Ship";
import shipDb from "~/tempDb/shipDb";
import {Stats, CurrentStats} from "../Ship/Stats/Stats";
import PlayerModel from "~/Player/PlayerModel";
import playerDb from "~/tempDb/playerDb";

class PlayerAdapter
{
    constructor()
    {
        this.playerIdCounter = 1;
        this.players = {};
        this.connectionsId = {};
        this.onlinePlayers = 0;
        this.playerDb = playerDb;
    }


	/**
	 * @param {string} token
	 * @returns {PlayerModel}
	 */
	createNewPlayer(token) {
		console.log("Creating new player", this.playerIdCounter, token);
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
		return new PlayerModel(this.playerIdCounter, "Guest" + this.playerIdCounter, "Earth", true, "Earth", 1000, 0, token, ships);
	}


	getPlayerByToken(token)
	{
		if (this.playerDb[token]) {
			return PlayerModel.buildPlayer(this.playerDb[token]);
		} else {
			return this.createNewPlayer(token);
		}
	}
}

export default PlayerAdapter;