import LoginController from "/Login/LoginController";
import PlayerController from "/Player/PlayerController";
import ChatController from "/Chat/ChatController";
import MarketController from "/Market/MarketController";

/**
 *
 * @type {{login: {controller, action: string}, disconnect: {controller, action: string}, chatSent: {controller, action: string}, landPlayerOnStar: {controller, action: string}, departPlayerFromStar: {controller, action: string}, playerEnteredLounge: {controller, action: string}, playerEnteredMarket: {controller, action: string}, playerLeftMarket: {controller, action: string}, playerLeftLounge: {controller, action: string}, playerBuyResource: {controller: MarketController, action: string}, playerSellResource: {controller: MarketController, action: string}, jumpPlayerToNode: {controller, action: string}}}
 */
const routes = {
	'login' : {
		'controller' : LoginController,
		'action' : 'login'
	},
	'disconnect' : {
		'controller' : LoginController,
		'action' : 'disconnect'
	},
	'chatSent' : {
		'controller' : ChatController,
		'action' : 'chatSent'
	},
	'landPlayerOnStar' : {
		'controller' : PlayerController,
		'action' : 'landPlayerOnStar'
	},
	'departPlayerFromStar' : {
		'controller' : PlayerController,
		'action' : 'departPlayerFromStar'
	},
	'playerEnteredLounge' : {
		'controller' : PlayerController,
		'action' : 'playerEnteredLounge'
	},
	'playerEnteredMarket' : {
		'controller' : PlayerController,
		'action' : 'playerEnteredMarket'
	},
	'playerLeftMarket' : {
		'controller' : PlayerController,
		'action' : 'playerLeftMarket'
	},
	'playerLeftLounge' : {
		'controller' : PlayerController,
		'action' : 'playerLeftLounge'
	},
	'playerBuyResource' : {
		'controller' : MarketController,
		'action' : 'playerBuyResource'
	},
	'playerSellResource' : {
		'controller' : MarketController,
		'action' : 'playerSellResource'
	},
	'jumpPlayerToNode' : {
		'controller' : PlayerController,
		'action' : 'jumpPlayerToNode'
	}
};

export default routes;