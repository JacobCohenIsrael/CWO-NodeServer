import EventManager from "~/Service/EventManager";
import PlayerAdapter from "~/Player/PlayerAdapter";
import PlayerService from "~/Player/PlayerService";
import NodeService from "~/Node/NodeService";
import NotificationService from "~/Notification/NotificationService";
import SocketIOService from "~/Network/SocketIOService";

class ServiceManager
{
	/**
	 *
	 * @param {Config} config
	 */
    constructor(config) {
        this.services = {};
        this.config = config;
    }

    get(service) {

        if (!this.services[service.name]) {
            this.services[service.name] = new service(this);
        }
        return this.services[service.name];
    }

	/**
	 *
	 * @param key
	 * @param service
	 */
	set(key, service) {
    	this.services[key] = service;
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

    /**
	 *
     * @returns {NotificationService}
     */
    getNotificationService() {
    	return this.get(NotificationService);
	}

    /**
	 *
     * @returns {SocketIOService}
     */
	getSocketIOService() {
    	return this.get(SocketIOService);
	}
}

export default ServiceManager;