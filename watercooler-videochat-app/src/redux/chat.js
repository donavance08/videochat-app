import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
	name: 'chat',
	initialState: {
		activeContact: {},
	},
	reducers: {
		setActiveContact: (state, action) => {
			state.activeContact = action.payload;
		},
	},
});

export const { setActiveContact } = chatSlice.actions;

export default chatSlice.reducer;
