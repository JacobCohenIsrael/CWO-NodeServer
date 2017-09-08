import EventEmitter from "events";

class EventManager extends EventEmitter {
    subscribe(Event, callback)
    {
        this.on(Event.name, callback);
    }

	/**
     *
	 * @param {BaseEvent} event
	 * @param args
	 */
	dispatch(event, ...args)
    {
        this.emit(event.eventName, event, ...args);
    }

	/**
	 * @param {BaseEvent} event
	 * @param {Function} callback
	 */
    subscribeOnce(event, callback)
    {
        this.once(event.eventName, callback);
    }
}

export default EventManager;