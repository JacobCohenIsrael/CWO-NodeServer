import BaseEvent from "~/Event/BaseEvent";

class SocketIOResponseEvent extends BaseEvent
{
	constructor(socket, response) {
		super();
		this.socket = socket;
		this.response = response;
	}
}
export default SocketIOResponseEvent;