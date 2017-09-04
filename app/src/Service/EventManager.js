class EventManager {
    constructor() {
        
        this.eventMapper = new Map();
    }
    
    set function(eventName, eventHandler) {
        this.eventMapper(event, eventHandler);
    };
}