import routes from "./routes";

export default class RoutingListener
{
	constructor() {
		this.routes = routes;
	}
	/**
	 * @param {RequestEvent} requestEvent
	 */
	onRequestEvent(requestEvent)
	{
		const route = requestEvent.route;

		if (this.routes[route]) {
			requestEvent.setController(routes[route].controller);
			requestEvent.setAction(routes[route].action);
		} else {
			console.log(`${route} does not exist`);
		}
	}
}