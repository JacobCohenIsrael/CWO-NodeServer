class LoginController
{
    constructor(serviceManager)
    {
        this.playerService = serviceManager.getPlayerService();
        this.nodeService = serviceManager.getNodeService();
        this.playerAdapter = serviceManager.getPlayerAdapter();
        this.eventManager = serviceManager.getEventManager();
    }

    login(socket, request) {
        const token = request.token;
        let player = this.playerService.getPlayerByToken(token);
        this.playerAdapter.connectionsId[socket.id] = player.id;
        this.playerAdapter.players[player.id] = player;
        this.playerAdapter.onlinePlayers++;
        socket.emit('loginResponse', {
            player: player,
            node: this.nodeService.nodes[player.currentNodeName],
            worldMap: this.nodeService.worldMap
        });
    }

    disconnect(socket) {
        const player = this.playerAdapter.players[this.playerAdapter.connectionsId[socket.id]];
        const currentNode = this.nodeService.nodes[player.currentNodeName];
        if (currentNode.hasOwnProperty('star') && !player.isLanded) {
            player.isLanded = true;
            socket.to('node' + player.currentNodeName).emit('shipLeftNode', { playerId: player.id });
            delete this.nodeService.nodes[player.currentNodeName].ships[player.id];
            delete this.playerAdapter.players[player.token];
            this.playerAdapter.onlinePlayers--;
        }
        this.playerAdapter.playerDb[player.token] = player;
        delete this.playerAdapter.connectionsId[socket.id];
    };
}

export default LoginController;