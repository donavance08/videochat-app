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

		console.log(`socket online ${socket.id}`);
		console.log('Registered users');
		connectedUsers.forEach((socket) => {
			console.log(`${socket.userId} : ${socket.id}`);
		});

		socket.emit('connection', { message: 'Socket online', id: socket.id });

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
			console.log('user disconnected', id);

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

module.exports.fireReceiveMsgEvent = async ({
	sender,
	receiver,
	savedMessage,
}) => {
	const senderSocket = connectedUsers.get(sender.toString());
	const receiverSocket = connectedUsers.get(receiver.toString());

	if (!(senderSocket && receiverSocket)) {
		return;
	}

	console.log(`${senderSocket.id} sending message to ${receiverSocket.id}`);
	const sockets = await io.fetchSockets();

	const filteredSocket = sockets.filter(
		(socket) => socket.userId === receiver.toString()
	);

	console.log('sockets online');
	filteredSocket.forEach((s) => {
		console.log(`${s.userId} : ${s.id}`);
		console.log(`connected: ${s.connected}`);
	});

	if (senderSocket && receiverSocket) {
		senderSocket.to(receiverSocket.id).emit('receive msg', savedMessage);
	}
};
