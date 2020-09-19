import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import * as UiStateSlice from "./redux/UiStateSlice";
import { USERNAME } from "./Const";
import * as DateUtils from "./DateUtils";
import "./App.css";

function Login(props) {
  const [username, setUsername] = useState('a');
  const [pass, setPass] = useState('');
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const dispatch = useDispatch();

  useEffect(() => fetchData(uiState.now));

  function fetchData(monthDate) {
    const year = moment(monthDate).format('YYYY');
    const month = moment(monthDate).format('MM');
    const daysInMonth = DateUtils.getDaysInMonth(year, month);
    const from = monthDate + '-01';
    const till = monthDate + '-' + daysInMonth;

    fetch(`http://localhost:8000/bookingEntries/${USERNAME}/${from}/${till}`, {
      headers: {
        'auth-token': localStorage.getItem('jwt')
      }
    })
      .then((response) => {
        if (response.ok)
          return response.json();
        else
          throw response
      })
      .then((json) => dispatch(BookingEntriesSlice.setBookingEntries(json)))
      .catch((error) => {
        if (error.status === 401)
          dispatch(UiStateSlice.setActiveMenuItem(1))
        else
          dispatch(UiStateSlice.setCurrentError('Kann keine Daten vom Server empfangen.'));
      }
      );
  }


  /**
 * 
 */
  function handleSubmit(e) {
    e.preventDefault();
    // console.log('handle submit');
    // postData('http://localhost:8000/api/user/login', {email: username, password: pass})
    fetch('http://localhost:8000/api/user/login', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: username, password: pass }),
    })
      .then(function (response) {
        if (response.status === 400)
          dispatch(UiStateSlice.setCurrentError('Login ist gescheitert'));
        else
          return response.json();
      }).then(json => {
        localStorage.setItem('jwt', json.jwt)
        fetchData(uiState.now);
        dispatch(UiStateSlice.setActiveMenuItem(0));
      })
      .catch((err) => {
        dispatch(UiStateSlice.setCurrentError('Serveranfrage ist gescheitert'));
      });
  }

  /**
 * 
 * @param {*} event 
 */
  function handleChange(event) {
    switch (event.target.name) {
      case "username":
        setUsername(event.target.value);
        break;
      case "pass":
        setPass(event.target.value);
        break;
      default:
        break;
    }
  }

  return (
    <div className="month">
      <div className="error">{uiState.currentError}</div>
      <p>Login</p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <div>Benutzername</div>
          <div>
            <input
              name="username"
              type="text"
              onChange={handleChange}
            />
          </div>
          <div>Passwort</div>
          <div>
            <input
              name="pass"
              type="password"
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ marginBottom: '0.3em', marginTop: '0.3em' }}>
          <input
            type="submit"
            value="Senden"
            className="button"
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
