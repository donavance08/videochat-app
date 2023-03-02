module.exports = (app) => {
	const connectedUsers = new Map();

	app.io.on('connection', (socket) => {
		socket.on('connect socket', (payload) => {
			console.log('socket connected', payload.id);
			connectedUsers.set(payload.id, socket.id);
			socket.userId = payload.id;

			console.log(connectedUsers);
		});

		socket.on('send msg', (payload) => {
			const receiver = connectedUsers.get(payload.receiver);

			if (receiver) {
				socket.to(receiver).emit('receive msg', {
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
};
