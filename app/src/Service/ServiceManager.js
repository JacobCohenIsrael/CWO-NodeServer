class ServiceManager
{
    constructor() {
        this.services = {};
    }

    get(serviceName) {
        if (this.services[serviceName] !== 'undefined') {
            return this.services[serviceName];
        }
        return null;
    }

    set(serviceName, service)
    {
        this.services[serviceName] = service;
    }

	/**
	 * @returns {LoginController}
	 */
	getLoginController() {
        return this.get('loginController');
    }

	/**
	 * @returns {PlayerService}
	 */
	getPlayerService() {
		return this.get('playerService');
	}

	/**
     * @returns {PlayerAdapter}
	 */
	getPlayerAdapter()
    {
        return this.get('playerAdapter');
    }
}

export default ServiceManager;