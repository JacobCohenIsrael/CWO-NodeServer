import ServiceManager from "/Service/ServiceManager";
import Application from "/Application/Application";
import RequestEvent from "/Request/Events/RequestEvent";
import RoutingListener from "/Router/RoutingListener";
import BootstrapEvent from "/Application/Events/BootstrapEvent";
import NetworkListener from "/Network/NetworkListener";
import Config from "/Config/Config";
import path from 'path';
import express from 'express';

const config = new Config();
const serviceManager = new ServiceManager(config);
const eventManager = serviceManager.getEventManager();
const networkListener = new NetworkListener(serviceManager);
const routingListener = new RoutingListener();
eventManager.subscribe(BootstrapEvent, networkListener.onBootstrap.bind(networkListener));
eventManager.subscribe(RequestEvent, routingListener.onRequestEvent.bind(routingListener));
const application = new Application(serviceManager);
application.express.use(express.static(path.join(__dirname + '/../')));
application.express.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/../index.html'));
});
application.run();