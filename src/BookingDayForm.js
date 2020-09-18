import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patchData } from "./serverConnections/connect";
import { USERNAME } from "./Const";
import moment from "moment";
import { DAY_FORMAT } from "./Const";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import * as UiStateSlice from "./redux/UiStateSlice";

function BookingDayForm(props) {
  const dispatch = useDispatch();
  const bookingEntry = useSelector((state) =>
    BookingEntriesSlice.selectBookingEntryByDay(state, props.utcBookingDay)
  );
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  
  const [start, setStart] = useState(bookingEntry === undefined || bookingEntry.start === undefined ? "" : moment(bookingEntry.start).format('HH:mm'));
  const [end, setEnd] = useState(bookingEntry === undefined || bookingEntry.end === undefined ? "" : moment(bookingEntry.end).format('HH:mm'));
  const [pause, setPause] = useState(bookingEntry === undefined || bookingEntry.pause === undefined ? "" : bookingEntry.pause);
  const [activities, setActivities] = useState(bookingEntry === undefined || bookingEntry.activities === undefined ? "" : bookingEntry.activities);
  const [error, setError] = useState('');

  /**
   * 
   * @param {*} item 
   */
  function sendEntryToBackend(item) {
    patchData(`http://localhost:8000/bookingEntries/${USERNAME}`, item)
      .then(response => {
        if (response.ok)
          response.json()
        else
          throw new Exception('Speichern auf dem Server ist fehlgeschlagen.');
      })
      .catch((err) => {
        dispatch(UiStateSlice.setCurrentError('Speichern ist nicht möglich. Keine Antwort vom Server.'));
        throw new Exception(err.message);
      });
  }

  /**
   * 
   * @param {*} message 
   */
  function Exception(message) {
    this.message = message;
  }

  /**
  * 
  * @param {*} reqStart 
  * @param {*} reqEnd 
  */
  function checkInputs(reqStart, reqEnd, reqPause) {
    if (!moment(reqStart, 'HH:mm').isValid())
      throw new Exception('Keine gültige Eingabe für \'Start\'')
    if (!moment(reqEnd, 'HH:mm').isValid())
      throw new Exception('Keine gültige Eingabe für  \'Ende\'')
    const start = moment(reqStart, 'HH:mm');
    const end = moment(reqEnd, 'HH:mm');
    if (!end.isAfter(start))
      throw new Exception(' \'Ende\' kann nicht vor \'Start\' liegen');

    const pause = moment.duration(reqPause);
    const workingTime = moment.duration(end.diff(start));
    if (workingTime - pause <= 0)
      throw new Exception('Arbeitszeit muss größer als Pause sein');
  }

  /**
   * 
   * @param {*} e 
   */
  function handleSubmit(e) {
    e.preventDefault()
    const entryToEdit = {
      username: USERNAME,
      day: props.utcBookingDay.toJSON(),
      start: new Date(moment(props.utcBookingDay).format(DAY_FORMAT) + 'T' + start).toJSON(),
      end: new Date(moment(props.utcBookingDay).format(DAY_FORMAT) + 'T' + end).toJSON(),
      pause: pause,
      activities: activities
    }
    try {
      checkInputs(start, end, pause);
      sendEntryToBackend(entryToEdit);
      if (uiState.currentError === '') {
        dispatch(BookingEntriesSlice.editBookingEntry(entryToEdit));
      }
      props.handleClose();
    } catch (error) {
      setError(error.message)
    }
  }

  /**
   * 
   * @param {*} event 
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "start":
        setStart(event.target.value);
        break;
      case "end":
        setEnd(event.target.value);
        break;
      case "pause":
        setPause(event.target.value);
        break;
      case "activities":
        setActivities(event.target.value);
        break;
      default:
        break;
    }
  }

  return (
    <div style={{ marginLeft: '1.75em', marginRight: '1.75em' }}>
      <div className="error">{error}{uiState.currentError}</div>
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
              value={start}
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
              value={end}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>Pause</div>
        <div>
          <input
            name="pause"
            type="time"
            maxLength="5"
            className="time-input"
            value={pause}
            onChange={handleChange}
          />
        </div>
        <div>Tätigkeiten</div>
        <div>
          <input
            name="activities"
            type="textarea"
            value={activities}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: '0.3em', marginTop: '0.3em' }}>
          <input
            type="submit"
            value={props.submitButtonValue}
            className="button"
          />
        </div>
      </form>
    </div >
  );
}

export default BookingDayForm;
