import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
};

const userSlice = createSlice({
    name: 'currentUser',
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.currentUser = action.payload;
        },
        userUpdated: (state, action) => {
            state.currentUser = action.payload;
        },
        userLoggedOut: (state) => {
            state.currentUser = null;
        },
        userDeleted: (state) => {
            state.currentUser = null;
        },
    },
});

export const { userLoggedIn, userUpdated, userLoggedOut, userDeleted } = userSlice.actions;

export default userSlice.reducer;