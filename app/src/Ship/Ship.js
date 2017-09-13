import {CurrentStats, Stats} from "/Ship/Stats/Stats";

/**
 * @type Ship
 */
class Ship {
    /**
     * @param {Stats} baseStats
     * @param {CurrentStats} currentStats
     * @param {string} shipClass
     * @param {string} shipType
     * @param {Part[]} shipParts
     * @param {Object} shipCargo
     * @param {Object} slots
     */
    constructor (baseStats, currentStats, shipClass, shipType, shipParts, shipCargo, slots) {
        this.baseStats = baseStats;
        this.currentStats = currentStats;
        this.shipClass = shipClass;
        this.shipType = shipType;
        this.shipParts = shipParts;
        this.shipCargo = shipCargo;
        this.slots = slots;
        this.initMaxStats();
        this.initCurrentStats();
    }

    /**
     * Initializes current stats
     */
    initCurrentStats() {
        this.currentStats.maximizeCurrentStats(this.maxStats);
    }

    /**
     * Calculates the maximum stats based on the ship's base stats and all its parts
     */
    initMaxStats() {
        this.maxStats = new Stats();
        for (let statName in this.baseStats) {
            this.maxStats[statName] = this.baseStats[statName];
        }
        for (let shipPartIndex in this.shipParts) {
            let partStats = this.shipParts[shipPartIndex].partStats;
            for (let statName in partStats) {
                this.maxStats[statName] += partStats[statName];
            }
        }
    }
}
export default Ship;