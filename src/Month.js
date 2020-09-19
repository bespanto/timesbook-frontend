import React, { useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import * as DateUtils from "./DateUtils";
import Day from "./Day";
import Popup from "./Popup";
import BookingDayForm from "./BookingDayForm";
import shortid from "shortid";
import "./App.css";
import moment from "moment";
import * as UiStateSlice from "./redux/UiStateSlice";
import { DAY_FORMAT } from "./Const";


function Month(props) {
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const [bookingDateToEdit, setBookingDateToEdit] = useState('');
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const dispatch = useDispatch();

  /**
   * 
   */
  function getDayComponents() {
    const daysInMonth = DateUtils.getDaysInMonth(moment(uiState.now).format('YYYY'), moment(uiState.now).format('MM'));
    let days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const bookingDay = moment(uiState.now + '-' + (day <= 9 ? '0' + day : day)).format(DAY_FORMAT);
      days.push(
        <Day
          key={shortid.generate()}
          bookingDay={bookingDay}
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

    const month = moment(uiState.now).subtract(1, 'months').format('YYYY-MM');
    dispatch(UiStateSlice.setNow(month));
    props.fetchData();
  }

  /**
   * 
   * @param {*} e 
   */
  function monthUp(e) {
    e.preventDefault();

    const month = moment(uiState.now).add(1, 'months').format('YYYY-MM');
    dispatch(UiStateSlice.setNow(month));
    props.fetchData();
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
            {DateUtils.getMonthName(moment(uiState.now).month())} {moment(uiState.now).year()}
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
            bookingDay={bookingDateToEdit}
            submitButtonValue="Speichern"
            handleClose={closePopup}
          />
        </Popup>
      )}
      {uiState.currentError !== '' &&
        <Popup handleClose={closeErrorPopup}>
          <div style={{ marginLeft: '0.75em', marginRight: '0.75em', marginBottom: '2em', marginTop: '1em' }}>
            <div className="error">{uiState.currentError}</div>
          </div>
        </Popup>
      }
    </div>
  );
}

export default Month;
