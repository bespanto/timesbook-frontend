import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import * as DateUtils from "./DateUtils";
import "./App.css";

function Day(props) {
  const bookingEntry = useSelector((state) =>
    BookingEntriesSlice.selectBookingEntryByDay(state, props.utcBookingDay)
  );

  const timeFormat = 'HH:mm';
  const placeholder = '--:--';
  let start = placeholder;
  let end = placeholder;
  let workingTime = placeholder;
  let overtime = placeholder;

  if (bookingEntry !== undefined) {
    start = moment(bookingEntry.start)
    end = moment(bookingEntry.end)
    workingTime = moment.duration(end.diff(start))
    start = start.format(timeFormat);
    end = end.format(timeFormat);
    overtime = DateUtils.minutesToTimeString(workingTime.asMinutes() - 8 * 60)
    workingTime = DateUtils.minutesToTimeString(workingTime.asMinutes());
  }

  return (
    <div className="row day">
      <div className="col-12">
        {DateUtils.getWeekday(props.utcBookingDay)}, {props.utcBookingDay.getDate()}.
      </div>
      <div className="col-2 text-center text-muted">
        {start}
      </div>
      <div className="col-2 text-center text-muted day-item">
        {end}
      </div>
      <div className="col-2 text-center text-muted day-item">
        {workingTime}
      </div>
      <div className="col-2 text-center text-muted day-item">
        {overtime}
      </div>
      <div className="col-2 text-center day-item small">
        <input
          type="button"
          value="Edit"
          className="button"
          onClick={() => props.showPopup(props.utcBookingDay)}
        ></input>
      </div>
      <div className="col-2 text-center day-item small">
        <input
          type="button"
          value="Löschen"
          className="button"
        ></input>
      </div>
    </div>
  );
}

export default Day;
