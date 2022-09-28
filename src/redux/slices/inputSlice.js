import { createSlice } from '@reduxjs/toolkit';

export const typesSlice = createSlice({
    name: 'type',
    reducers: {
        setType: (state, action) => {
            state.type = action.payload
        }
    }
})