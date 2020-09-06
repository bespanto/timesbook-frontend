import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import * as DateUtils from "./DateUtils";

function BookingDayForm(props) {
  const dispatch = useDispatch();
  const bookingEntry = useSelector((state) =>
    BookingEntriesSlice.selectBookingEntryByDay(state, props.date)
  );
  const [editStart, setEditStart] = useState(bookingEntry === undefined ? "" : bookingEntry.start);
  const [editEnd, setEditEnd] = useState(bookingEntry === undefined ? "" : bookingEntry.end);
  const [editBreak, setEditBreak] = useState(bookingEntry === undefined ? "" : bookingEntry.break);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault()

    let error = '';
    try {
      DateUtils.getWorkingTimeInMinutes(editStart, editEnd, editBreak)
    } catch (err) {
      error = err.message;
    }

    if (error !== '')
      setError(error);
    else {
      setError('');
      dispatch(
        BookingEntriesSlice.editBookingEntry(
          {
            day: DateUtils.getNormalizedDateString(props.date),
            start: editStart,
            end: editEnd,
            break: editBreak,
          }
        )
      );
      props.handleClose();
    }
  }

  function handleChange(event) {
    switch (event.target.name) {
      case "start":
        setEditStart(event.target.value);
        break;
      case "end":
        setEditEnd(event.target.value);
        break;
      case "break":
        setEditBreak(event.target.value);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <div className="error">{error}</div>
      <p>{DateUtils.getNormalizedDateString(props.date)}</p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <div>Start</div>
          <div>
            <input
              id="start"
              name="start"
              type="time"
              maxLength="5"
              className="time-input"
              value={editStart}
              onChange={handleChange}
            />
          </div>
          <div>Ende</div>
          <div>
            <input
              name="end"
              type="time"
              maxLength="5"
              className="time-input"
              value={editEnd}
              onChange={handleChange}
            />
          </div>
          <div>Pause</div>
          <div>
            <input
              name="break"
              type="time"
              maxLength="5"
              className="time-input"
              value={editBreak}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <input
            type="submit"
            value={props.submitButtonValue}
            className="button"
          />
        </div>
      </form>
    </div>
  );
}

export default BookingDayForm;
