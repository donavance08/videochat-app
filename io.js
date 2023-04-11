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

			connectedUsers.delete(socket.userId);
		});

		socket.on('initiate video call', (payload) => {
			const callee = connectedUsers.get(payload.to);

			if (callee) {
				io.to(callee.id).emit('initiate video call', payload);
			} else {
				io.to(socket.id).emit('decline video call', { reason: 'offline' });
			}
		});

		socket.on('accept video call', (payload) => {
			const to = connectedUsers.get(payload.to);

			if (to) {
				io.to(to.id).emit('accept video call', payload.signal);
			}
		});

		socket.on('end video call', (payload) => {
			const to = connectedUsers.get(payload.to);
			if (to) {
				io.to(to.id).emit('end video call', payload);
			}
		});

		socket.on('decline video call', (payload) => {
			const to = connectedUsers.get(payload.to);
			if (to) {
				io.to(to.id).emit('decline video call', payload);
			}
		});
	});

	return io;
};

module.exports.emit = (listener, payload) => {
	const socket = connectedUsers.get(payload.userId.toString());

	if (socket) {
		io.to(socket.id).emit(listener, payload);
		return true;
	}

	return false;
};
