import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import * as DateUtils from "./DateUtils";
import Day from "./Day";
import Popup from "./Popup";
import BookingDayForm from "./BookingDayForm";
import shortid from "shortid";
import "./App.css";

function Month(props) {
  const [bookingDateToEdit, setBookingDateToEdit] = useState('');
  const [now, setNow] = useState(new Date());
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const daysInMonth = DateUtils.getDaysInMonth(now.getFullYear(), now.getMonth());

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

  function monthDown(e) {
    e.preventDefault();
    if (now.getMonth() === 0) setNow(new Date(now.getFullYear() - 1, 11));
    else setNow(new Date(now.getFullYear(), now.getMonth() - 1));
  }

  function monthUp(e) {
    e.preventDefault();
    if (now.getMonth() === 11) setNow(new Date(now.getFullYear() + 1, 0));
    else setNow(new Date(now.getFullYear(), now.getMonth() + 1));
  }

  function showPopup(date) {
    setBookingDateToEdit(date);
    setPopupIsVisible(true);
  }

  function closePopup(date) {
    setPopupIsVisible(false);
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
        <div className="row">
          <div className="col-2 text-center small">Start</div>
          <div className="col-2 text-center day-item small">Ende</div>
          <div className="col-2 text-center day-item small">Ist</div>
          <div className="col-2 text-center day-item small">+/-</div>
          <div className="col-2 text-center day-item small"></div>
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
    </div>
  );
}

export default Month;
