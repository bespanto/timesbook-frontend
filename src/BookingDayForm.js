import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patchData, deleteData } from "./serverConnections/connect";
import { USERNAME } from "./Const";
import moment from "moment";
import { DAY_FORMAT, HOST } from "./Const";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import * as UiStateSlice from "./redux/UiStateSlice";

function BookingDayForm(props) {
  const dispatch = useDispatch();
  const bookingEntry = useSelector((state) =>
    BookingEntriesSlice.selectBookingEntryByDay(state, props.bookingDay)
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
  function saveEntryToBackend(item) {
    patchData(`http://${HOST}/bookingEntries/${USERNAME}`, localStorage.getItem('jwt'), item)
      .then(response => {
        if (response.ok)
          return response.json()
        else
          if (response.status === 401) {
            dispatch(UiStateSlice.setActiveMenuItem(1)) // nicht eingeloggt
            throw response;
          }
          else
            throw response;
      })
      .then((data) => {
        dispatch(BookingEntriesSlice.editBookingEntry(data));
        props.handleClose();
      })
      .catch((error) => {
        dispatch(UiStateSlice.setCurrentError('Speichern ist nicht möglich. Keine Verbindung zum Server.'));
        throw new Exception('ERROR: ' + error);
      });
  }

  /**
   * 
   */
  function save() {
    const entryToEdit = {
      username: USERNAME,
      day: moment.utc(props.bookingDay).format(),
      start: new Date(moment(props.bookingDay).format(DAY_FORMAT) + 'T' + start).toJSON(),
      end: new Date(moment(props.bookingDay).format(DAY_FORMAT) + 'T' + end).toJSON(),
      pause: pause,
      activities: activities
    }
    try {
      checkInputs(start, end, pause);
      saveEntryToBackend(entryToEdit);
    } catch (error) {
      setError(error.message)
    }
  }

  /**
   * 
   * @param {*} item 
   */
  function deleteEntryFromBackend(item) {
    deleteData(`http://${HOST}/bookingEntries/${USERNAME}/${item.day}`, localStorage.getItem('jwt'), item)
      .then(response => {
        if (response.ok)
          return response.json()
        else
          if (response.status === 401) {
            dispatch(UiStateSlice.setActiveMenuItem(1)) // nicht eingeloggt
            throw response;
          }
          else
            throw response;
      })
      .then((data) => {
        dispatch(BookingEntriesSlice.deleteBookingEntry(item.day));
        props.handleClose();
      })
      .catch((error) => {
        dispatch(UiStateSlice.setCurrentError('Löschen ist nicht möglich. Keine Verbindung zum Server.'));
        throw new Exception('ERROR: ' + error);
      });
  }

  /**
 * 
 */
  function remove() {
    const entryToDelete = {
      day: moment.utc(props.bookingDay).format(),
    }
    try {
      deleteEntryFromBackend(entryToDelete);
    } catch (error) {
      setError(error.message)
    }
  }

  /**
   * 
   */
  function Exception(message) {
    this.message = message;
  }

  /**
  * 
  */
  function checkInputs(reqStart, reqEnd, reqPause) {
    if (!moment(reqPause, 'HH:mm').isValid())
      throw new Exception('\'Pause\' muss angegeben werden');
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
      <div className="error">{error}</div>
      <p>{moment(props.bookingDay).format('DD.MM.YYYY')}</p>
      <div>
        <div>Start</div>
        <div>
          <input
            name="start"
            type="time"
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
        <button type="button" className="button" onClick={() => remove()}>
          Löschen
        </button>
        <button type="button" className="button" onClick={(e) => save()}>
          {props.submitButtonValue}
        </button>
      </div>
    </div >
  );
}

export default BookingDayForm;
