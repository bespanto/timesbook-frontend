import { createSlice } from "@reduxjs/toolkit";
import * as DateUtils from "../DateUtils";

// selectors
export const selectBookingEntries = (state) => state.bookingEntries;
export const selectBookingEntryByDay = (state, date) =>{
  return state.bookingEntries.find((item) => item.day === DateUtils.getDateString(date))
};

const bookingEntriesMap = [
  {
    day: "2020-8-2",
    start: "08:20",
    end: "12:35",
    break: "01:10",
  },
  {
    day: "2020-8-3",
    start: "09:40",
    end: "15:45",
    break: "02:15",
  },
];

export const initialState = bookingEntriesMap;

//slice
export const bookingEntriesSlice = createSlice({
  name: "bookingEntries",
  initialState: initialState,
  reducers: {
    editBookingEntry: (state, action) => {
      console.log(action.payload);
      let found = false;
      state.forEach(element => {
        if(element.day  === action.payload.day){
          element.start = action.payload.start;
          element.end = action.payload.end;
          element.break = action.payload.break;
          found = true;
        }
      });
      if(!found)
        state.push(action.payload);
    },
  },
});

export const { editBookingEntry } = bookingEntriesSlice.actions;
