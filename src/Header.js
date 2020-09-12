import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import * as DateUtils from "./DateUtils";
import moment from "moment";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import * as UiStateSlice from "./redux/UiStateSlice";
import {USERNAME, DAY_FORMAT} from "./Const";
import "./App.css";

function Header(props) {
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const now = new Date();
    const daysInMonth = DateUtils.getDaysInMonth(now.getFullYear(), now.getMonth());
    const from = moment.utc(new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))).format(DAY_FORMAT)
    const till = moment.utc(new Date(Date.UTC(now.getFullYear(), now.getMonth(), daysInMonth))).format(DAY_FORMAT)

    fetch(`http://localhost:8000/bookingEntries/${USERNAME}/${from}/${till}`)
      .then((response) => response.json())
      .then((json) => dispatch(BookingEntriesSlice.setBookingEntries(json)))
      .catch((error) => setErrorTemporally('Verbindung zum Server nicht möglich'))
  }, []);

  async function setErrorTemporally(error) {
    setError(error);
    window.setTimeout(() => setError(''), 10000);
  }

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-dark bg-dark">
        <div className="dropdown">
          <button className="navbar-toggler" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <span className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem(0))}>Calendar</span>
            <span className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem(1))}>Panel 2</span>
            <span className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem(2))}>Panel 3</span>
          </div>
        </div>
        <div>
          <span className={error === '' ? '' : 'hidden error'} >{error}</span>
        </div>
        <div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
