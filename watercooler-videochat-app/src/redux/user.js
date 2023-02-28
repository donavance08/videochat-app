import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		token: '',
		nickname: '',
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
	},
});

export const { setNickname, setToken } = userSlice.actions;

export default userSlice.reducer;
