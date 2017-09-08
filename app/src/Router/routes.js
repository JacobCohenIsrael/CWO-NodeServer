import LoginController from "~/Login/LoginController";

/**
 *
 * @type {{login: {controller: LoginController, action: string}}}
 */
const routes = {
	"login" : {
		"controller" : LoginController,
		"action" : "login"
	}
}

export default routes;