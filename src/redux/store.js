
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { uiStateSlice } from "./UiStateSlice";
import { bookingEntriesSlice } from "./BookingEntriesSlice";

const reducer = {
  uiState: uiStateSlice.reducer,
  bookingEntries: bookingEntriesSlice.reducer
};

const middleware = [...getDefaultMiddleware()];

export default configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
});
