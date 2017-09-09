import socket from 'socket.io';
import http from 'http';
import ServerService from "./ServerService";

class NetworkListener
{
	constructor() {
	}

	/**
	 *
	 * @param {BootstrapEvent} bootstrapEvent
	 */
	onBootstrap(bootstrapEvent) {
		const server = http.Server(bootstrapEvent.app.express);
		const io = socket(server);
		const app = bootstrapEvent.app;
		const port = process.env.PORT || bootstrapEvent.app.serviceManager.config.get('server.port');
		io.on('connection', (socket) => {
			socket.use((packet, next) => {
				app.handleSocketIORequest(packet, next, socket);
			});
		});
		server.listen(port, () => {
			console.log(`Server listening on port ${port}`);
		});

		ServerService.setIO(io);
		ServerService.setServer(server);
	}
}

export default NetworkListener;