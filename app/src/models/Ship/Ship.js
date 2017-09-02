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
     */
    constructor (baseStats, currentStats, shipClass, shipType, shipParts) {
        this.baseStats = baseStats;
        this.currentStats = currentStats;
        this.shipClass = shipClass;
        this.shipType = shipType;
        this.shipParts = shipParts;

        this.initCurrentStats();
    }

    /**
     * Maximize the current stats
     */
    initCurrentStats() {
        this.currentStats.maximizeCurrentStats(this.baseStats);
    }
}
export default Ship;