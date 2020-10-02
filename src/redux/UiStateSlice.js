import { createSlice } from '@reduxjs/toolkit'
import moment from "moment";

// selectors
export const selectUiState = (state) => state.uiState

export const initialState = {
    now: moment().format('YYYY-MM'),
    activeMenuItem: 'TimeBooking',
    currentError: '',
    loggedIn: false,
    profile: {
        name: '',
        username: '',
        organization: '',
        role: ''
    }
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
        },
        setProfile: (state, action) => {
            if (action.payload === null)
                state.profile = null
            else {
                state.profile.name = action.payload.name;
                state.profile.username = action.payload.username;
                state.profile.organization = action.payload.organization;
                state.profile.role = action.payload.role;
            }
        }
    }
})

export const { setActiveMenuItem, setCurrentError, setNow, setLoggedIn, setProfile } = uiStateSlice.actions;