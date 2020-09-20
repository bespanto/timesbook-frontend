import { createSlice } from '@reduxjs/toolkit'
import moment from "moment";

// selectors
export const selectUiState = (state) => state.uiState

export const initialState = {
    now: moment().format('YYYY-MM'),
    activeMenuItem: 0,
    currentError: '',
    loggedIn: false
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
        },
        setNow: (state, action) => {
            state.now = action.payload;
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        }
    }
})

export const { setActiveMenuItem, setCurrentError, setNow, setLoggedIn } = uiStateSlice.actions;