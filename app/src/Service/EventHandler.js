/**
 * @type EventHandler
 */
class EventHandler {
    /**
     * @param {Object} controller 
     * @param {Function} action 
     */
    constructor(controller, action) {
        this.controller = controller;
        this.action = action;
    }

    activate(socket, data) {
        return new this.controller()[this.action](socket, data);
    }
}

export default EventHandler;