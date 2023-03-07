const sio = require('socket.io');

let io;
let connectedUsers = new Map();

module.exports.initialize = (server) => {
	io = sio(server, {
		cors: {},
		reconnectionDelayMax: 10000,
	});

	io.on('connection', (socket) => {
		socket.on('connect socket', (payload) => {
			// console.log('socket connected', payload.id);
			connectedUsers.set(payload.id, socket);
			socket.userId = payload.id;
		});

		socket.on('send msg', (payload) => {
			console.log('send msg triggered');

			const receiverSocket = connectedUsers.get(payload.receiver);

			if (receiverSocket) {
				socket.to(receiverSocket.id).emit('receive msg', {
					message: payload.message,
					sender: payload.sender,
				});
			}

			//ADD message to database
		});

		socket.on('disconnect', () => {
			const id = socket.userId;

			if (connectedUsers.delete(socket.userId)) {
				console.log(`${id} disconnected from server`);
			}
		});
	});

	return io;
};

module.exports.getIO = () => {
	return io;
};

module.exports.fireReceiveMsgEvent = (payload) => {
	const senderSocket = connectedUsers.get(payload.sender.toString());
	const receiverSocket = connectedUsers.get(payload.receiver.toString());

	if (senderSocket && receiverSocket) {
		senderSocket.to(receiverSocket.id).emit('receive msg', payload);
	}
};

module.exports.fireImageSendEvent = (payload) => {};
