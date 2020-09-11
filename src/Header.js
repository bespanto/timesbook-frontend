import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { patchData } from "./serverConnections/connect";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import * as UiStateSlice from "./redux/UiStateSlice";
import {USERNAME} from "./Const";
import "./App.css";

function Header(props) {
  const [error, setError] = useState('');
  const bookingEntries = useSelector((state) => BookingEntriesSlice.selectBookingEntries(state));
  const dispatch = useDispatch();

  function sendEntryToBackend(item) {
    patchData(`http://localhost:8000/bookingEntries/${USERNAME}`, item)
      .then(response => {
        if (response.ok)
          return response.json()
        else
          throw response
      })
      .catch(() => setErrorTemporally('Can\'t save data in backend'));
  }

  async function setErrorTemporally(error) {
    setError(error);
    window.setTimeout(() => setError(''), 3000);
  }

  function syncAll() {
    bookingEntries.forEach(
      item => {
        sendEntryToBackend(item);
      }
    )
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
          <input type="button" value="Sync" className="button" onClick={() => syncAll()}></input>
        </div>
      </nav>
    </header>
  );
}

export default Header;
