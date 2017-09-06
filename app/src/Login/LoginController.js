class LoginController
{
    constructor(serviceManager)
    {
        this.playerService = serviceManager.get('playerService');
        this.nodeService = serviceManager.get('nodeService');
        this.playerAdapter = serviceManager.get('playerAdapter');
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
}

export default LoginController;