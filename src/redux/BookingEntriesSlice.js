import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { DAY_FORMAT} from "../Const";

// selectors
export const selectBookingEntries = (state) => state.bookingEntries;
export const selectBookingEntryByDay = (state, date) =>{
  return state.bookingEntries.find((item) => moment(item.day).format(DAY_FORMAT) === moment(date).format(DAY_FORMAT))
};

const bookingEntriesMap = [];
//  [
//   {
//     day: "2020-09-02",
//     start: "2020-09-02T08:20Z",
//     end: "2020-09-02T12:35Z",
//     pause: "01:10",
//   },
//   {
//     day: "2020-09-03",
//     start: "2020-09-03T09:40Z",
//     end: "2020-09-03T15:45Z",
//     pause: "02:15",
//   },
// ];

export const initialState = bookingEntriesMap;

//slice
export const bookingEntriesSlice = createSlice({
  name: "bookingEntries",
  initialState: initialState,
  reducers: {
    editBookingEntry: (state, action) => {
      let found = false;
      state.forEach(element => {
        if(moment(element.day).format(DAY_FORMAT)  === moment(action.payload.day).format(DAY_FORMAT)){
          element.start = action.payload.start;
          element.end = action.payload.end;
          element.pause = action.payload.pause;
          element.activities = action.payload.activities;
          found = true;
        }
      });
      if(!found){
        state.push(action.payload);
      }
    },
    setBookingEntries: (state, action) => {
      state.length = 0;
      state.push(...action.payload);
    },
    deleteBookingEntry: (state, action) => {
      const newArr = state.filter(element => moment(element.day).format(DAY_FORMAT) !== moment(action.payload).format(DAY_FORMAT))
      state.length = 0;
      state.push(...newArr);
    },
  },
});

export const { editBookingEntry, setBookingEntries, deleteBookingEntry } = bookingEntriesSlice.actions;
