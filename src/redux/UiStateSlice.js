import { createSlice } from '@reduxjs/toolkit'
import moment from "moment";

// selectors
export const selectUiState = (state) => state.uiState

export const initialState = {
    now: moment().format('YYYY-MM'),
    activeMenuItem: localStorage.getItem('jwt') ? 'TimeBooking' : 'Login',
    currentError: '',
    profile: null,
    profileChanged: new Date().getTime()
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
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setProfileChanged: (state, action) => {
            state.profileChanged = action.payload;
        }
    }
})

export const { setActiveMenuItem, setCurrentError, setNow, setProfile, setProfileChanged } = uiStateSlice.actions;