class BaseEvent
{
	constructor() {
		this.eventName = this.constructor.name;
	}

}

export default BaseEvent;