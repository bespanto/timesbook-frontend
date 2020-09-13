import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faEdit } from '@fortawesome/free-solid-svg-icons'
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
  let pause = placeholder;
  let workingTime = placeholder;
  let overtime = placeholder;
  const activities = bookingEntry === undefined ? '' : bookingEntry.activities;

  if (bookingEntry !== undefined) {
    start = moment(bookingEntry.start);
    end = moment(bookingEntry.end);
    pause = moment.duration(bookingEntry.pause);
    workingTime = moment.duration(end.diff(start));
    start = start.format(timeFormat);
    end = end.format(timeFormat);
    overtime = DateUtils.minutesToTimeString(workingTime.asMinutes() - pause.asMinutes() - 8 * 60);
    workingTime = DateUtils.minutesToTimeString(workingTime.asMinutes() - pause.asMinutes());
    pause = DateUtils.minutesToTimeString(pause.asMinutes());
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
        {pause}
      </div>
      <div className="col-2 text-center text-muted day-item">
        {workingTime}
      </div>
      <div className="col-2 text-center text-muted day-item">
        {overtime}
      </div>
      <div className="col-2 text-center day-item">
        <button className="button" onClick={() => props.showPopup(props.utcBookingDay)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        {/* <button className="button">
          <FontAwesomeIcon icon={faEraser} />
        </button> */}
      </div>
      <div className="col-12 text-left text-muted">
        <small>{activities}</small>
      </div>
    </div>
  );
}

export default Day;
