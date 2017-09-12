export default class NotificationService
{
    constructor(serviceManager) {

    }

    sendNotification(socket, message) {
        socket.emit('notificationReceived', { notificationText: message });
    }
}