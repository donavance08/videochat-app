import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		token: '',
		nickname: '',
		id: '',
	},
	reducers: {
		setToken: (state, action) => {
			console.log('token', action.payload);
			state.token = action.payload;
		},
		setNickname: (state, action) => {
			console.log('nickname', action.payload);
			state.nickname = action.payload;
		},
		setId: (state, action) => {
			state.id = action.payload;
		},
	},
});

export const { setNickname, setToken, setId } = userSlice.actions;

export default userSlice.reducer;
