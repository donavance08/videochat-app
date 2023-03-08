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
				// if message is an image and user logged is owner
				if (datum.filename && datum.sender.toString() === userId) {
					return { isOwner: true, image: datum.filename };
				}

				//if message is image and user logged is NOT owner
				if (datum.filename) {
					return { isOwner: false, image: datum.filename };
				}

				if (datum.sender.toString() === userId) {
					return { isOwner: true, message: datum.message };
				}

				return { isOwner: false, message: datum.message };
			});

			state.messages = organizedMessages;
		},

		deleteLastMessage: (state) => {
			const newMessages = state.messages.slice(0, state.messages.length - 1);
			return { ...state, messages: newMessages };
		},

		clearMessages: (state) => {
			return { ...state, messages: [] };
		},

		changeLoadingStatus: (state, action) => {
			state.isLoading = action.payload;
		},
		resetChatState: (state) => {
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
	resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
