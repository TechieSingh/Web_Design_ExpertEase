// src/features/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    isFirstLogin: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    isFirstLogin: false, // Default to false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string, isFirstLogin: boolean }>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isFirstLogin = action.payload.isFirstLogin;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.isFirstLogin = false;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
