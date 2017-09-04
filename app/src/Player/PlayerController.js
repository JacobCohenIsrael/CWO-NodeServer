import PlayerService from './PlayerService';
class PlayerController {
    constructor() {
        this.playerService = new PlayerService();
    }

    login(socket, request) {
        this.playerService.login(socket, request);
    }

    test(a, b) {
        console.log(a,b);
    }
}

export default PlayerController;