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

		console.log(`${socket.id} connected. id: ${socket.userId}`);
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
			console.log(`socket ${socket.id}initiated call to `, callee.id);
			if (callee) {
				io.to(callee.id).emit('initiateCall', payload);
			} else {
				io.to(socket.id).emit('cancelCall', { status: 'callee not available' });
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

			console.log(`callee ${socket.id} accepted call from `, to.id);
			io.to(to.id).emit('acceptCall', payload.signal);

			//set a response back to calle when caller became offline
		});

		socket.on('cancelCall', (payload) => {
			const to = connectedUsers.get(payload.to);
			if (to) {
				io.to(to.id).emit('cancelCall', payload.reason);
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
