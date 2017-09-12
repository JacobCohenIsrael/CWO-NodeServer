import NodeService from "~/Node/NodeService";
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
const playerAdapter = serviceManager.getPlayerAdapter();
const nodeService = serviceManager.get(NodeService);
const application = new Application(serviceManager);

const routingListener = new RoutingListener();
eventManager.subscribe(RequestEvent, routingListener.onRequestEvent.bind(routingListener));
application.run();
//let logInterval = setInterval(logStuff, 3000);

//let marketPriceChangeInterval = setInterval(adjustMarketPrices, 1000*3);

function adjustMarketPrices()
{
    for (let nodeName in nodeService.nodes)
    {
        if (nodeService.nodes[nodeName].hasOwnProperty('market') && nodeName !== "Siera") {
            const resourceList = nodeService.nodes[nodeName].market.resourceList;
            for (let resourceName in resourceList) {
                console.log(`${nodeName} - ${resourceName}`);
                console.log(resourceList[resourceName]);
                const resource = resourceList[resourceName];
                console.log("buy - sell", resource.boughtAmount - resource.soldAmount);
                console.log("normalize", 100 * (playerAdapter.onlinePlayers + 1) * (resource.buyPrice - resource.sellPrice));
                console.log("overall", (resource.boughtAmount - resource.soldAmount) / ( 100 * (playerAdapter.onlinePlayers + 1) * (resource.buyPrice - resource.sellPrice)));
                let newPriceDelta = (resource.boughtAmount - resource.soldAmount) / ( 100 * (playerAdapter.onlinePlayers + 1) * (resource.buyPrice - resource.sellPrice) );
				if (newPriceDelta > 0) {
					newPriceDelta = Math.floor(newPriceDelta);
				} else {
					newPriceDelta = Math.ceil(newPriceDelta);
				}
				console.log("delta: ", newPriceDelta);
                if (newPriceDelta !== 0) {
                    resource.buyPrice += newPriceDelta;
                    resource.sellPrice = Math.floor(0.7*resource.buyPrice);
                    resource.boughtAmount = 0;
                    resource.soldAmount = 0;
                    io.to('market' + nodeName).emit('resourcePriceChanged', { resource: resource });
                }
            }
        }
    }
}


function logStuff() {
    console.log("**************************** Players ****************************");
    for (let token in playerAdapter.players) {
        console.log("**************************** Player " + playerAdapter.players[token].id + " ****************************");
        console.log(playerAdapter.players[token]);
    }

    console.log("**************************** Stars ****************************");
    for (let nodeName in nodeService.nodes) {
        if (nodeName === "Earth") {
            console.log("**************************** Node " + nodeName + " ****************************");
            console.log(syntaxHighlight(nodeService.nodes[nodeName]));
        }
    }
}

function syntaxHighlight(json) {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return match;
    });
}
process.syntaxHighlight = syntaxHighlight;