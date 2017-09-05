import playerDb from "~/tempDb/playerDb";
import PlayerBuilder from "~/Player/PlayerBuilder";
class PlayerAdapter
{
    constructor()
    {
        this.playerIdCounter = 1;
        this.playerBuilder = new PlayerBuilder();
        this.players = {};
        this.connectionsId = {};
        this.onlinePlayers = 0;
    }

    getPlayerByToken(token)
    {
        let player = null;
        if (playerDb.hasOwnProperty(token)) {
            player = this.playerBuilder.createPlayer(playerDb[token]);
        } else {
            player = this.playerBuilder.createNewPlayer(this.playerIdCounter, token);
            playerDb[token] = player;
            this.playerIdCounter++;
        }
        return player;
    }
    
    removePlayerTracksOnNode(player) {
        delete NodesInitializer.nodes[player.currentNodeName].ships[player.id];
    }
}

export default PlayerAdapter;