module.exports = class Ship {
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
};