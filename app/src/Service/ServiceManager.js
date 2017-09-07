import EventManager from "./EventManager";
import PlayerAdapter from "../Player/PlayerAdapter";
import PlayerService from "../Player/PlayerService";
import NodeService from "../Node/NodeService";

class ServiceManager
{
    constructor() {
        this.services = {};
    }

    get(service) {

        if (!this.services[service.name]) {
            this.services[service.name] = new service(this);
        }
        return this.services[service.name];
    }

	/**
	 * @returns {PlayerService}
	 */
	getPlayerService() {
		return this.get(PlayerService);
	}

	/**
     * @returns {PlayerAdapter}
	 */
	getPlayerAdapter()
    {
        return this.get(PlayerAdapter);
    }

    /**
     * @returns {EventManager}
     */
    getEventManager() {
	    return this.get(EventManager);
    }

    /**
     * @returns {NodeService}
     */
    getNodeService() {
        return this.get(NodeService);
    }
}

export default ServiceManager;