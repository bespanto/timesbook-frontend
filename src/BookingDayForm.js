import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {DAY_FORMAT} from "./Const";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";

function BookingDayForm(props) {
  const dispatch = useDispatch();
  const bookingEntry = useSelector((state) =>
    BookingEntriesSlice.selectBookingEntryByDay(state, props.utcBookingDay)
  );
  const [editStart, setEditStart] = useState(bookingEntry === undefined ? "" : moment(bookingEntry.start).format('HH:mm'));
  const [editEnd, setEditEnd] = useState(bookingEntry === undefined ? "" : moment(bookingEntry.end).format('HH:mm'));

  /**
   * 
   * @param {*} e 
   */
  function handleSubmit(e) {
    e.preventDefault()
    dispatch(
      BookingEntriesSlice.editBookingEntry(
        {
          day: props.utcBookingDay.toJSON(),
          start: new Date(moment(props.utcBookingDay).format(DAY_FORMAT) + 'T' + editStart).toJSON(),
          end: new Date(moment(props.utcBookingDay).format(DAY_FORMAT) + 'T' + editEnd).toJSON(),
        }
      )
    );
    props.handleClose();
  }

  /**
   * 
   * @param {*} event 
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "start":
        setEditStart(event.target.value);
        break;
      case "end":
        setEditEnd(event.target.value);
        break;
      default:
        break;
    }
  }

  return (
    <div style={{marginLeft: '1.75em', marginRight: '1.75em'}}>
      <p>{moment(props.utcBookingDay).format('DD.MM.YYYY')}</p>
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
        </div>
        <div style={{marginBottom: '0.3em', marginTop: '0.3em'}}>
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
