class ServerService
{
	static get io() {
		return ServerService._io;
	}

	static get server() {
		return ServerService._server;
	}

	static setIO(io) {
		ServerService._io = io;
	}

	static setServer(server) {
		ServerService._server = server;
	}
}

export default ServerService;