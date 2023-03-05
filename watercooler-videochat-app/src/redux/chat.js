import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
	name: 'chat',
	initialState: {
		activeContactId: '',
		activeContactName: '',
		messages: [],
		isLoading: true,
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

		setArrayOfMessages: (state, action) => {
			const { data, userId } = action.payload;

			const organizedMessages = data.map((datum) => {
				if (datum.sender.toString() === userId) {
					return { isOwner: true, message: datum.message };
				}

				return { isOwner: false, message: datum.message };
			});

			state.messages = organizedMessages;
		},

		deleteLastMessage: (state) => {
			state.messages = state.messages.slice(0, state.messages.length - 1);
		},

		clearMessages: (state) => {
			state.messages = [];
		},

		changeLoadingStatus: (state, action) => {
			state.isLoading = action.payload;
		},
		resetState: (state) => {
			state.activeContactId = '';
			state.activeContactName = '';
			state.messages = [];
			state.isLoading = true;
		},
	},
});

export const {
	setActiveContactId,
	setActiveContactName,
	setMessage,
	clearMessages,
	setArrayOfMessages,
	deleteLastMessage,
	changeLoadingStatus,
	resetState,
} = chatSlice.actions;

export default chatSlice.reducer;
