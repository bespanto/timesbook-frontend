import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import * as DateUtils from "./DateUtils";
import Day from "./Day";
import Popup from "./Popup";
import BookingDayForm from "./BookingDayForm";
import * as UiStateSlice from "./redux/UiStateSlice";
import shortid from "shortid";
import "./App.css";
import moment from "moment";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import { USERNAME, DAY_FORMAT } from "./Const";

function Month(props) {
  const dispatch = useDispatch();
  const [bookingDateToEdit, setBookingDateToEdit] = useState('');
  const [now, setNow] = useState(new Date());
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const daysInMonth = DateUtils.getDaysInMonth(now.getFullYear(), now.getMonth());
  const globError = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );

  useEffect(() => fetchData(now), []);

  function fetchData(monthDate) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = DateUtils.getDaysInMonth(year, month);
    const from = moment.utc(new Date(Date.UTC(year, month, 1))).format(DAY_FORMAT)
    const till = moment.utc(new Date(Date.UTC(year, month, daysInMonth))).format(DAY_FORMAT)

    fetch(`http://localhost:8000/bookingEntries/${USERNAME}/${from}/${till}`)
      .then((response) => response.json())
      .then((json) => dispatch(BookingEntriesSlice.setBookingEntries(json)))
      .catch((error) =>
        dispatch(UiStateSlice.setCurrentError('Kann keine Daten vom Server empfangen.'))
      );
  }


  /**
   * 
   */
  function getDayComponents() {
    let days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const utcBookingDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), day));
      days.push(
        <Day
          key={shortid.generate()}
          utcBookingDay={utcBookingDay}
          showPopup={showPopup}
        />
      );
    }
    return days;
  }

  /**
   * 
   * @param {*} e 
   */
  function monthDown(e) {
    e.preventDefault();

    let monthDate;
    if (now.getMonth() === 0)
      monthDate = new Date(now.getFullYear() - 1, 11)
    else
      monthDate = new Date(now.getFullYear(), now.getMonth() - 1);

    fetchData(monthDate);
    setNow(monthDate);
  }

  /**
   * 
   * @param {*} e 
   */
  function monthUp(e) {
    e.preventDefault();

    let monthDate;
    if (now.getMonth() === 11)
      monthDate = new Date(now.getFullYear() + 1, 0);
    else
      monthDate = new Date(now.getFullYear(), now.getMonth() + 1);

    fetchData(monthDate);
    setNow(monthDate);
  }

  /**
   * 
   * @param {*} date 
   */
  function showPopup(date) {
    setBookingDateToEdit(date);
    setPopupIsVisible(true);
  }

  /**
   * 
   * @param {*} date 
   */
  function closePopup() {
    setPopupIsVisible(false);
  }

  /**
 * 
 * @param {*} date 
 */
  function closeErrorPopup() {
    dispatch(UiStateSlice.setCurrentError(''));
  }

  return (
    <div className="month">
      <div>
        <div className="row day">
          <div className="col-2">
            <button className="button" onClick={(e) => monthDown(e)}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          </div>
          <div className="col-8">
            {DateUtils.getMonthName(now)} {now.getFullYear()}
          </div>
          <div className="col-2">
            <button className="button" onClick={(e) => monthUp(e)}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
        <div className="row day">
          <div className="col-2 text-center small">Start</div>
          <div className="col-2 text-center day-item small">Ende</div>
          <div className="col-2 text-center day-item small">Pause</div>
          <div className="col-2 text-center day-item small">Ist</div>
          <div className="col-2 text-center day-item small">+/-</div>
          <div className="col-2 text-center day-item small"></div>
        </div>
      </div>
      <div>{getDayComponents()}</div>
      {popupIsVisible && (
        <Popup handleClose={closePopup}>
          <BookingDayForm
            utcBookingDay={bookingDateToEdit}
            submitButtonValue="Speichern"
            handleClose={closePopup}
          />
        </Popup>
      )}
      {globError.currentError !== '' &&
        <Popup handleClose={closeErrorPopup}>
          <div style={{ marginLeft: '0.75em', marginRight: '0.75em', marginBottom: '2em', marginTop: '1em' }}>
            <div className="error">{globError.currentError}</div>
          </div>
        </Popup>
      }
    </div>
  );
}

export default Month;
