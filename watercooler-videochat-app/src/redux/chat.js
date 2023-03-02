import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
	name: 'chat',
	initialState: {
		activeContactId: '',
		activeContactName: '',
		messages: [],
	},
	reducers: {
		setActiveContactId: (state, action) => {
			state.activeContactId = action.payload;
		},
		setActiveContactName: (state, action) => {
			state.activeContactName = action.payload;
		},

		setMessage: (state, action) => {
			state.messages = [...state.messages, action.payload];
		},

		clearMessages: (state) => {
			state.messages = [];
		},
	},
});

export const {
	setActiveContactId,
	setActiveContactName,
	setMessage,
	clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
