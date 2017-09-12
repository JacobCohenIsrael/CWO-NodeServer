import RequestEvent from "~/Request/Events/RequestEvent";
import BootstrapEvent from "~/Application/Events/BootstrapEvent";
import express from 'express';
export default class Application
{
	/**
	 * @param {ServiceManager} serviceManager
	 */
	constructor(serviceManager) {
		this.serviceManager = serviceManager;
		this.eventManager = serviceManager.getEventManager();
		this.express = express();
		this.controllers = {};
	}

	run() {
		this.eventManager.dispatch(new BootstrapEvent(this));
	}

	handleSocketIORequest(packet, next, socket)
	{
		let route = packet[0];
		let data = packet[1];
		const args = [socket];
		for (let key in data) {
			switch(key) {
				case 'player':
					const player = this.serviceManager.getPlayerService().getOnlinePlayer(socket, data[key].id, data[key].token);
					args.push(player);
					break;
				default:
					args.push(data[key]);
			}
	   }
		this.handleRequest(route, ...args);
		next();
	}

	handleRequest(route, ...args) {
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
			return;
		}

		let response = null;
		if (requestEvent.action) {
			response = controller[requestEvent.action](...args);
		}
		return response;
	}
}