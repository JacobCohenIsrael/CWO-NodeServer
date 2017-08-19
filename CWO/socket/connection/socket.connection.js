const playersDb = require('../../tempDB/playerDb.json');
const nodeDb = require('../../tempDB/nodeDb.json');

module.exports = (socket, idCounter, players, newPlayer) => {
    function login(data) {
        if (!playersDb.hasOwnProperty(data.player.token))
            {
                playersDb[data.player.token] = newPlayer;
                idCounter++;
            }
            const player = playersDb[data.player.token];
            player.ships[0].cachedShipStats = {
                "hull" : 50,
                "cargoCapacity": 50,
                "jumpDistance": 10,
                "energyRegen": 2,
                "energyCapacity": 10
            };
            players[player.id] = player;
            socket.emit('loginResponse', {'success' : true, player : player, starsList : nodeDb });
    }

    return {
        login: login
    };
};