import ServiceManager from "~/Service/ServiceManager";
import Application from "~/Application/Application";
import RequestEvent from "~/Request/Events/RequestEvent";
import RoutingListener from "~/Router/RoutingListener";
import BootstrapEvent from "~/Application/Events/BootstrapEvent";
import NetworkListener from "~/Network/NetworkListener";
import Config from "~/Config/Config";

const config = new Config();
const serviceManager = new ServiceManager(config);
const networkListener = new NetworkListener(serviceManager);
const eventManager = serviceManager.getEventManager();
eventManager.subscribe(BootstrapEvent, networkListener.onBootstrap.bind(networkListener));
const application = new Application(serviceManager);

const routingListener = new RoutingListener();
eventManager.subscribe(RequestEvent, routingListener.onRequestEvent.bind(routingListener));
application.run();