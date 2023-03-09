const sio = require('socket.io');

let io;
let connectedUsers = new Map();

module.exports.initialize = (server) => {
	io = sio(server, {
		cors: {},
		reconnectionDelayMax: 10000,
	});

	io.on('connection', (socket) => {
		connectedUsers.set(socket.handshake.headers.id, socket);
		socket.userId = socket.handshake.headers.id;

		socket.emit('connection', { message: 'Socket online' });
		// console.log(connectedUsers);

		socket.on('send msg', (payload) => {
			const receiverSocket = connectedUsers.get(payload.receiver);

			if (receiverSocket) {
				socket.to(receiverSocket.id).emit('receive msg', {
					message: payload.message,
					sender: payload.sender,
				});
			}
		});

		socket.on('disconnect', () => {
			const id = socket.userId;

			if (connectedUsers.delete(socket.userId)) {
				console.log(`${id} disconnected from server`);
			}
		});

		socket.on('initiateCall', (payload) => {
			io.to(payload.callee).emit('initiateCall', payload);

			// need signal data and caller
		});

		socket.on('acceptCall', (payload) => {
			io.to(payload.caller).emit('acceptCall', payload.signal);
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
