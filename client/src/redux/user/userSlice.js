import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },


        updateStart: (state) => {
            state.loading = true;
        },
        updateSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },


        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.currentUser = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        signOutUserStart: (state) => {
            state.loading = true;
        },
        signOutUserSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.currentUser = null;
        },
        signOutUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const {signInStart, signInSuccess, signInFailure, updateStart, updateFailure, updateSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess} = userSlice.actions;

export default userSlice.reducer;