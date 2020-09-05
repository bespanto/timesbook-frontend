import { createSlice } from '@reduxjs/toolkit'

// selectors
export const selectUiState = (state) => state.uiState

export const initialState = {
        activeMenuItem: 0,
        currentError: ''
    }

//slice
export const uiStateSlice = createSlice({
    name: "uiState",
    initialState: initialState,
    reducers: {
        setActiveMenuItem: (state, action) => {
            state.activeMenuItem = action.payload;
        },
        setCurrentError: (state, action) => {
            state.currentError = action.payload;
        }
    }
})

export const { setActiveMenuItem, setCurrentError } = uiStateSlice.actions;