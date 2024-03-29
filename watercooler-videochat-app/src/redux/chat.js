import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	activeContactId: '',
	activeContactName: '',
	activeContactPhoneNumber: '',
	messages: [],
};

export const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setActiveContactId: (state, action) => {
			return {
				...state,
				activeContactId: action.payload,
			};
		},
		setActiveContactName: (state, action) => {
			return {
				...state,
				activeContactName: action.payload,
			};
		},

		setActiveContactPhoneNumber: (state, action) => {
			return {
				...state,
				activeContactPhoneNumber: action.payload,
			};
		},

		setMessage: (state, action) => {
			const messages = [...state.messages, action.payload];

			return { ...state, messages: messages };
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

			return { ...state, messages: organizedMessages };
		},

		deleteLastMessage: (state) => {
			const newMessages = state.messages.slice(0, state.messages.length - 1);
			return { ...state, messages: newMessages };
		},

		clearMessages: (state) => {
			return { ...state, messages: [] };
		},

		resetChatState: (state) => {
			return initialState;
		},
	},
});

export const {
	setActiveContactId,
	setActiveContactName,
	setActiveContactPhoneNumber,
	setMessage,
	clearMessages,
	setArrayOfMessages,
	deleteLastMessage,
	resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
