import nodeDb from "~/tempDB/nodeDb";

class NodeService {
    constructor(serviceManager) {
        this.worldMap = {};
        this.nodes = {};
        this.initNodes(nodeDb);
        this.playerAdapter = serviceManager.getPlayerAdapter();
    }

    initNodes(nodeDb) {
        for (let nodeName in nodeDb) {
            let node = nodeDb[nodeName];
            this.nodes[nodeName] = node;
            this.worldMap[nodeName] = {
                name: node.name,
                coordX: node.coordX,
                coordY: node.coordY,
                sprite: node.sprite,
                connectedNodes: node.connectedNodes
            };
            if (node.hasOwnProperty('star')) {
                this.worldMap[nodeName].star = node.star;
            }
        }
    }

	removeShipFromNode(nodeName, entityId) {
		delete this.nodes[nodeName].ships[entityId];
    }

    addShipToNode(nodeName, entityId, ship) {
        this.nodes[nodeName].ships[entityId] = ship;
    }
}

export default NodeService;