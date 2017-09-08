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
			socketIOResponseEvent.socket.emit('loginResponse', socketIOResponseEvent.response.emit);
		}
	}
}

export default SocketIOResponseListener;

