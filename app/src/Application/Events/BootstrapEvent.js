import BaseEvent from "/Event/BaseEvent";

class BootstrapEvent extends BaseEvent
{
	/**
	 *
	 * @param {Application} app
	 */
	constructor(app) {
		super();
		this.app = app;
	}
}

export default BootstrapEvent;