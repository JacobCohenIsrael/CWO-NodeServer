/**
 * @type Ship
 */
class Ship {
    /**
     * @param {number} id
     * @param {number} currentHullAmount
     * @param {number} currentShieldAmount
     * @param {number} currentEnergyAmount
     * @param {number} currentCargoHold
     * @param {string} shipClass
     * @param {string} shipType
     * @param {Object} shipCargo
     * @param {Part[]} shipParts
     */
    constructor (id, currentHullAmount, currentShieldAmount,currentEnergyAmount, currentCargoHold, shipClass, shipType, shipCargo, shipParts) {
        this.id = id;
        this.currentHullAmount = currentHullAmount;
        this.currentShieldAmount = currentShieldAmount;
        this.currentEnergyAmount = currentEnergyAmount;
        this.currentCargoHold = currentCargoHold;
        this.shipClass = shipClass;
        this.shipType = shipType;
        this.shipCargo = shipCargo;
        this.shipParts = shipParts;
    }
}
export default Ship;