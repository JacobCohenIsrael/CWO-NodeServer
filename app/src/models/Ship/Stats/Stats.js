/**
 * @type Stats
 */
class Stats {
    /**
     * @param {number | null} hull
     * @param {number | null} shieldRegen
     * @param {number | null} shieldCapacity
     * @param {number | null} energyRegen
     * @param {number | null} energyCapacity
     * @param {number | null} jumpDistance
     * @param {number | null} cargoCapacity
     */
    constructor(hull = null, shieldRegen = null, shieldCapacity = null, energyRegen = null, energyCapacity = null, jumpDistance = null, cargoCapacity = null) {
        this.hull = hull;
        this.shieldRegen = shieldRegen;
        this.shieldCapacity = shieldCapacity;
        this.energyRegen = energyRegen;
        this.energyCapacity = energyCapacity;
        this.jumpDistance = jumpDistance;
        this.cargoCapacity = cargoCapacity;
    }
}

/**
 * @type CurrentStats
 */
class CurrentStats {
    /**
     *
     * @param {number | null} hull
     * @param {number | null} shield
     * @param {number | null} energy
     * @param {number | null} cargo
     */
    constructor(hull = null, shield = null, energy = null, cargo = null) {
        this.hull = hull;
        this.shield= shield;
        this.energy = energy;
        this.cargo = cargo;
    }
}

export default Stats;