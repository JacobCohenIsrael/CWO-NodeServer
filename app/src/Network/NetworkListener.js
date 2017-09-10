import socket from 'socket.io';
import http from 'http';

class NetworkListener
{
	constructor(serviceManager) {
		this.serviceManager = serviceManager;
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
			console.log('Connecting Established');
			socket.use((packet, next) => {
				app.handleSocketIORequest(packet, next, socket);
			});
            socket.on('disconnect', function () {
                console.log("disconnecting");
                app.handleRequest('disconnect', ...[socket]);
            });
		});
		server.listen(port, () => {
			console.log(`Server listening on port ${port}`);
		});
	}
}

export default NetworkListener;