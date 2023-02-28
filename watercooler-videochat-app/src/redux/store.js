import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import chatReducer from './chat';

export default configureStore({
	reducer: {
		user: userReducer,
		chat: chatReducer,
	},
});
