import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patchData } from "./serverConnections/connect";
import { USERNAME } from "./Const";
import moment from "moment";
import { DAY_FORMAT } from "./Const";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";

function BookingDayForm(props) {
  const dispatch = useDispatch();
  const bookingEntry = useSelector((state) =>
    BookingEntriesSlice.selectBookingEntryByDay(state, props.utcBookingDay)
  );
  const [editStart, setEditStart] = useState(bookingEntry === undefined ? "" : moment(bookingEntry.start).format('HH:mm'));
  const [editEnd, setEditEnd] = useState(bookingEntry === undefined ? "" : moment(bookingEntry.end).format('HH:mm'));
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
        // Workaround für 'net::ERR_CONNECTION_REFUSED',
        // da throw new Exception() nicht funktioniert.
        setError('Speichern auf dem Server ist fehlgeschlagen.')
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
  function checkStartEnd(reqStart, reqEnd) {
    if (!moment(reqStart, 'HH:mm').isValid())
      throw new Exception('Keine gültige Eingabe für \'Start\'')
    if (!moment(reqEnd, 'HH:mm').isValid())
      throw new Exception('Keine gültige Eingabe für  \'Ende\'')
    const start = moment(reqStart, 'HH:mm');
    const end = moment(reqEnd, 'HH:mm');
    if (!end.isAfter(start))
      throw new Exception(' \'Ende\' kann nicht vor \'Start\' liegen');
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
      start: new Date(moment(props.utcBookingDay).format(DAY_FORMAT) + 'T' + editStart).toJSON(),
      end: new Date(moment(props.utcBookingDay).format(DAY_FORMAT) + 'T' + editEnd).toJSON(),
    }
    try {
      checkStartEnd(editStart, editEnd);
      sendEntryToBackend(entryToEdit);
      if (error !== ''){
        dispatch(BookingEntriesSlice.editBookingEntry(entryToEdit));
        props.handleClose();
      }
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
    <div style={{ marginLeft: '1.75em', marginRight: '1.75em' }}>
      <div className="error">{error}</div>
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
        <div style={{ marginBottom: '0.3em', marginTop: '0.3em' }}>
          <input
            type="submit"
            value={props.submitButtonValue}
            className="button"
            // UNSAUBER! Workaround für 'net::ERR_CONNECTION_REFUSED',
            // Nach dem Erscheinen der Fehlermeldung wird der Button deaktiviert.
            // Danach ist nur das Schließen möglich. Ansonsten wird das wiederholte Drücken trotz
            // der Fehlemeldung möglich!!! => Fehlverhalten: das Popup wird zugemacht und der
            // Eintrag wird in der Zeile gemacht
            disabled={error === 'Speichern auf dem Server ist fehlgeschlagen.' ? 'true' : ''}
          />
        </div>
      </form>
    </div>
  );
}

export default BookingDayForm;
