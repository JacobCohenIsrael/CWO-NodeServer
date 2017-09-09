class SocketIOResponseListener
{
	constructor() {

	}

	/**
	 *
	 * @param {SocketIOResponseEvent} socketIOResponseEvent
	 */
	onSocketIOResponse(socketIOResponseEvent) {
		if (socketIOResponseEvent.response.emit) {
			socketIOResponseEvent.socket.emit(socketIOResponseEvent.response.emit.eventName, socketIOResponseEvent.response.emit.eventData);
		}

		if (socketIOResponseEvent.response.to) {
			socketIOResponseEvent.socket.to(socketIOResponseEvent.response.to.roomName).emit(socketIOResponseEvent.response.to.emit.eventName, socketIOResponseEvent.response.to.emit.eventData);
		}

		if (socketIOResponseEvent.response.leave) {
			this.leaveRoom(socketIOResponseEvent.response.leave, socketIOResponseEvent.socket);
		}

		if (socketIOResponseEvent.response.join) {
			this.joinRoom(socketIOResponseEvent.response.leave, socketIOResponseEvent.socket);
		}
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

export default SocketIOResponseListener;

