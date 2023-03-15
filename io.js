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
		const recordsId = connectedUsers.get(socket.userId).id;

		console.log(`User: ${socket.userId} connected. Id: ${socket.id}`);
		console.log(
			`records show that the socket id saved ${
				recordsId === socket.id ? 'matches' : `does not match: ${recordsId}`
			} `
		);
		socket.emit('connection', { message: 'Socket online', id: socket.id });
		// console.log(connectedUsers);

		socket.on('send msg', (payload) => {
			console.log('event fired');
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
			console.log('connected users:');
			connectedUsers.forEach((s) => {
				console.log(s.id);
				if (s.id === socket.id) {
					console.log('matched caller');
				}
			});
			const callee = connectedUsers.get(payload.to);
			if (callee) {
				console.log(`socket ${socket.id}initiated call to `, callee.id);

				io.to(callee.id).emit('initiateCall', payload);
			} else {
				io.to(socket.id).emit('decline call', { reason: 'declined' });
			}
		});

		socket.on('acceptCall', (payload) => {
			console.log('connected users:');
			connectedUsers.forEach((s) => {
				console.log(s.id);
				if (s.id === socket.id) {
					console.log('matched caller');
				}
			});
			const to = connectedUsers.get(payload.to);
			if (to) {
				console.log(`callee ${socket.id} accepted call from `, to.id);
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
				console.log(`callee ${socket.id} declined call from ${to.id}`);
				io.to(to.id).emit('decline call', payload);
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
