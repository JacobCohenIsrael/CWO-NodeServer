class ServiceManager
{
    constructor() {
        this.services = {};
    }

    get(serviceName) {
        if (this.services[serviceName] !== 'defined') {
            return this.services[serviceName];
        }
        return null;
    }

    set(serviceName, service)
    {
        this.services[serviceName] = service;
    }
}

export default ServiceManager;