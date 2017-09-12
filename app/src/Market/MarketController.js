class MarketController
{
    constructor(serviceManager) {
        this.playerService = serviceManager.getPlayerService();
        this.nodeService = serviceManager.getNodeService();
        this.notificationService = serviceManager.getNotificationService();
    }

    playerBuyResource(socket, player, resource) {
        const resourceList = this.nodeService.nodes[player.currentNodeName].market.resourceList;
        if (!resourceList[resource.name]) {
            this.notificationService.sendNotification(socket, "This star does not contain this resource");
            return;
        }
        let totalPrice = resourceList[resource.name].buyPrice * resource.amount;
        if (player.credits < totalPrice) {
            this.notificationService.sendNotification(socket, "You do not have enough credits to purchase this resource");
            return;
        }

        if (player.getActiveShip().currentStats.cargo < resource.amount) {
            this.notificationService.sendNotification(socket, "Not enough space in cargo");
            return;
        }

        player.credits -= totalPrice;
        if (!player.getActiveShip().shipCargo[resource.name]) {
            player.getActiveShip().shipCargo[resource.name] = 0;
        }
        player.getActiveShip().shipCargo[resource.name] += resource.amount;
        this.nodeService.nodes[player.currentNodeName].market.resourceList[resource.name].boughtAmount += resource.amount;
        player.getActiveShip().currentStats.cargo -= resource.amount;
        socket.emit('playerBoughtResource', { player: player });
    }

    playerSellResource(socket, player, resource) {
        if (!player.getActiveShip().shipCargo[resource.name]) {
            this.notificationService.sendNotification(socket, "Player does not have this resource");
            return;
        }
        if (!player.getActiveShip().shipCargo[resource.name] >= resource.amount) {
            this.notificationService.sendNotification(socket, "Player does not have that amount of resource to sell");
            return;
        }
        const resourceList = this.nodeService.nodes[player.currentNodeName].market.resourceList;
        player.credits += resourceList[resource.name].sellPrice * resource.amount;
        player.getActiveShip().shipCargo[resource.name] -= resource.amount;
        this.nodeService.nodes[player.currentNodeName].market.resourceList[resource.name].soldAmount += resource.amount;
        player.getActiveShip().currentStats.cargo += resource.amount;
        socket.emit('playerSoldResource', { player: player });
    }
}

export default MarketController;