import PlayerAdapter from './PlayerAdapter';
class PlayerService {
    constructor() {
        this.playerAdapter = PlayerAdapter;
    }

    login(socket, request) {
        const token = request.token;

        let player = this.playerAdapter.getPlayerByToken(token);
        this.playerAdapter.connectionsId[socket.id] = player.id;
        this.playerAdapter.players[player.id] = player;
        socket.emit('loginResponse', {
            player: player,
            node: NodesInitializer.nodes[player.currentNodeName],
            worldMap: NodesInitializer.worldMap
        });
    }
}

export default PlayerService;