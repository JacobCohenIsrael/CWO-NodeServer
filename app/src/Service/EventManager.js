/**
 * @property {Map<string, EventHandler>} eventMapper
 * @type EventManager
 */
class EventManager {
    constructor() {
        
        this.eventMapper = new Map();
    }
    
    /**
     * @param {string} eventName 
     * @param {EventHandler} eventHandler 
     */
    setEvent(eventName, eventHandler) {
        this.eventMapper.set(eventName, eventHandler);
    }

    /**
     * @param {string} eventName 
     * @return {EventHandler | null}
     */
    getEvent(eventName) {
        return this.eventMapper.get(eventName)
    }
}

export default EventManager;