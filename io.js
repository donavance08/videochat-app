const sio = require('socket.io');

let io;
let connectedUsers = new Map();

module.exports.initialize = (server) => {
	io = sio(server, {
		cors: {},
		reconnectionDelayMax: 10000,
	});

	io.on('connection', (socket) => {
		socket.userId = socket.handshake.headers.id;
		connectedUsers.set(socket.handshake.headers.id, socket);

		console.log('Registered users');
		connectedUsers.forEach((socket) => {
			console.log(`${socket.userId} : ${socket.id}`);
		});

		socket.emit('connection', { message: 'Socket online', id: socket.id });

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

			socket.broadcast.emit('user disconnect', { id });

			if (connectedUsers.delete(socket.userId)) {
				console.log(`${id} disconnected from server`);
			}
		});

		socket.on('initiateCall', (payload) => {
			const callee = connectedUsers.get(payload.to);

			if (callee) {
				io.to(callee.id).emit('initiateCall', payload);
			} else {
				io.to(socket.id).emit('decline call', { reason: 'offline' });
			}
		});

		socket.on('acceptCall', (payload) => {
			const to = connectedUsers.get(payload.to);

			if (to) {
				io.to(to.id).emit('acceptCall', payload.signal);
			}
		});

		socket.on('drop call', (payload) => {
			const to = connectedUsers.get(payload.to);
			if (to) {
				io.to(to.id).emit('drop call', payload);
			}
		});

		socket.on('decline call', (payload) => {
			const to = connectedUsers.get(payload.to);
			if (to) {
				io.to(to.id).emit('decline call', payload);
			}
		});
	});

	return io;
};

module.exports.fireReceiveMsgEvent = async ({
	//Edit , can be combined with exports.emit and totaly remove this function
	sender,
	receiver,
	savedMessage,
}) => {
	const senderSocket = connectedUsers.get(sender.toString());
	const receiverSocket = connectedUsers.get(receiver.toString());

	if (!(senderSocket && receiverSocket)) {
		return;
	}

	if (senderSocket && receiverSocket) {
		io.to(receiverSocket.id).emit('receive msg', savedMessage);
	}
};

module.exports.emit = (listener, payload) => {
	const socket = connectedUsers.get(payload.userId.toString());

	if (socket) {
		io.to(socket.id).emit(listener, payload);
		return true;
	}

	return false;
};
