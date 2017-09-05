import EventEmitter from "events";

class EventManager extends EventEmitter {
    subscribe(eventName, callback)
    {
        this.on(eventName, callback);
    }

    dispatch(eventName, ...args)
    {
        this.emit(eventName, ...args);
    }

    subscribeOnce(eventName, callback)
    {
        this.once(callback);
    }
}

export default EventManager;