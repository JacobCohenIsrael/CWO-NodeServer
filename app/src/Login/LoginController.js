import PlayerAdapter from "~/Player/PlayerAdapter";
import NodesInitializer from "~/Node";
import ServiceManager from "~/Service/ServiceManager";
class LoginController
{
    constructor(serviceManager)
    {
        this.playerAdapter = serviceManager.get('playerAdapter');
    }

    login(socket, request) {
        const token = request.token;

        let player = this.playerAdapter.getPlayerByToken(token);
        this.playerAdapter.connectionsId[socket.id] = player.id;
        this.playerAdapter.players[player.id] = player;
        this.playerAdapter.onlinePlayers++;
        socket.emit('loginResponse', {
            player: player,
            node: NodesInitializer.nodes[player.currentNodeName],
            worldMap: NodesInitializer.worldMap
        });
    }
}

export default LoginController;