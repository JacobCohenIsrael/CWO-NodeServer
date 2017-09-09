import LoginController from "~/Login/LoginController";
import PlayerController from "~/Player/PlayerController";

/**
 *
 * @type {{login: {controller: LoginController, action: string}}}
 */
const routes = {
	'/player/login' : {
		'controller' : LoginController,
		'action' : 'login'
	},
	'landPlayerOnStar' : {
		'controller' : PlayerController,
		'action' : 'landPlayerOnStar'
	},
	'departPlayerFromStar' : {
		'controller' : PlayerController,
		'action' : 'departPlayerFromStar'
	}
};

export default routes;