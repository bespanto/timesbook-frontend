import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import Month from "./Month";
import "./App.css";
import * as UiStateSlice from "./redux/UiStateSlice";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import Login from "./Login";
import Profile from "./Profile";
import Employee from "./Employee";
import VacationRequests from "./VacationRequests";
import Vacation from "./Vacation";
import ResetPassword from "./ResetPassword";
import moment from "moment";
import * as DateUtils from "./DateUtils";

function Main(props) {
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state))
  const dispatch = useDispatch();
  let history = useHistory();
  const loc = useLocation();

  useEffect(() => {
    if (loc.pathname !== '/resetPassword') {
      if (!uiState.loggedIn)
        history.push('/Login');
      else {
        const year = moment(uiState.now).format('YYYY');
        const month = moment(uiState.now).format('MM');
        const daysInMonth = DateUtils.getDaysInMonth(year, month);
        const from = uiState.now + '-01';
        const till = uiState.now + '-' + daysInMonth;

        fetch(`${process.env.REACT_APP_API_URL}/bookingEntries/${uiState.profile.username}/${from}/${till}`, {
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
            if (error.status === 401) {
              dispatch(UiStateSlice.setLoggedIn(false));
              // history.push('/Login');
            }
            else
              dispatch(UiStateSlice.setCurrentError('Fehler! Der Server antwortet nicht.'));
          }
          );
      }
    }
  }, [dispatch, history, uiState.now, uiState.profile.username, uiState.loggedIn, loc.pathname]);


  return (
    <main >
      <div className="position-relative overflow-hidden">
        <Switch>
          <Route path="/TimeBooking">
            <Month />
          </Route>
          <Route path="/Login">
            {uiState.loggedIn ? <Profile /> : <Login />}
          </Route>
          <Route path="/Employees">
            <Employee />
          </Route>
          <Route path="/Vacation">
            <Vacation />
          </Route>
          <Route path="/VacationRequests">
            <VacationRequests />
          </Route>
          <Route path="/ResetPassword">
            <ResetPassword />
          </Route>
        </Switch>
      </div>
    </main>
  );
}

export default Main;
