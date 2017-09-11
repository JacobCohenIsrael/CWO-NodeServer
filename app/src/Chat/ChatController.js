export default class ChatController
{
    constructor(serviceManager) {

    }

    chatSent(socket, player, message) {
        socket.io.to(message.roomKey + player.currentNodeName).emit('chatMessageReceived', {
            senderId: player.id,
            senderName: player.firstName,
            receivedMessage: message.message,
            roomKey : message.roomKey
        });
    }
}

