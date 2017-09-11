import LoginController from "~/Login/LoginController";
import PlayerController from "~/Player/PlayerController";
import ChatController from "~/Chat/ChatController";

/**
 *
 * @type {{login: {controller: LoginController, action: string}}}
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
	}
};

export default routes;