import RequestEvent from "~/Request/Events/RequestEvent";

export default class Application
{
	/**
	 * @param {ServiceManager} serviceManager
	 */
	constructor(serviceManager) {
		this.serviceManager = serviceManager;
		this.eventManager = serviceManager.getEventManager();
		this.controllers = {};
	}

	handleSocketIORequest(packet, next)
	{
		let route = packet[0];
		let controller = null;
		const requestEvent = new RequestEvent(route);
		this.eventManager.dispatch(requestEvent);

		if (requestEvent.controller) {

			if (!this.controllers[requestEvent.controller.name]) {
				controller = new requestEvent.controller(this.serviceManager);
				this.controllers[requestEvent.controller.name] = controller;
			} else {
				controller = this.controllers[requestEvent.controller.name];
			}
		} else {
			next();
			return;
		}

		let response = null;
		let args = [packet[1]];
		if (requestEvent.action) {
			response = controller[requestEvent.action](...args);
		}

		if(response.emit) {

		}

		console.log(response);
	}
}