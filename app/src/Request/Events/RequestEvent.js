import BaseEvent from "/Event/BaseEvent";

class RequestEvent extends BaseEvent
{
	constructor(route) {
		super();
		this.route = route;
	}

	setController(controller) {
		this.controller = controller;
	}

	setAction(action) {
		this.action = action;
	}
}

export default RequestEvent;