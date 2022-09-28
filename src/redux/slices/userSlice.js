import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    is_Admin: true,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.is_Admin = action.payload;
        },
        setData: (state, action) => {
            return {
                ...state,
                ...action.payload,
            }
        },
        clearData: (state, action) => {
            return initialState;
        }
    }
});

export const { setUser, setData, clearData } = userSlice.actions;

export default userSlice.reducer;