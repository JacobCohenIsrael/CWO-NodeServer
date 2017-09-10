class SocketIOService
{
    constructor(serviceManager) {

    }

    leaveRoom(roomName, socket) {
        if (socket.rooms.hasOwnProperty(roomName)) {
            socket.leave(roomName);
        }
    }

    joinRoom(roomName, socket) {
        if (!socket.rooms.hasOwnProperty(roomName)) {
            socket.join(roomName);
        }
    }
}

export default SocketIOService;