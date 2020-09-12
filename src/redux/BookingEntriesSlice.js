import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { DAY_FORMAT} from "../Const";

// selectors
export const selectBookingEntries = (state) => state.bookingEntries;
export const selectBookingEntryByDay = (state, date) =>{
  return state.bookingEntries.find((item) => moment(item.day).format(DAY_FORMAT) === moment(date).format(DAY_FORMAT))
};

const bookingEntriesMap = []
//  [
//   {
//     day: "2020-09-02",
//     start: "08:20",
//     end: "12:35",
//     break: "01:10",
//   },
//   {
//     day: "2020-09-03",
//     start: "09:40",
//     end: "15:45",
//     break: "02:15",
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
          found = true;
        }
      });
      if(!found){
        state.push(action.payload);
      }
    },
    setBookingEntries: (state, action) => {
      state.push(...action.payload);
    },
  },
});

export const { editBookingEntry, setBookingEntries } = bookingEntriesSlice.actions;
