import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import Month from "./Month";
import Login from "./Login";
import Register from "./Register";
import RecoverPass from "./RecoverPass";
import Profile from "./Profile";
import Employee from "./Employee";
import VacationRequests from "./VacationRequests";
import Vacation from "./Vacation";
import ResetPassword from "./ResetPassword";
import ConfirmAccount from "./ConfirmAccount";
import Home from "./Home";
import moment from "moment";
import * as DateUtils from "./DateUtils";

function Main(props) {
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const dispatch = useDispatch();
  let history = useHistory();
  const loc = useLocation();

  useEffect(() => {
    if (loc.pathname !== "/ResetPassword" &&
      loc.pathname !== '/confirmAccount' &&
      loc.pathname !== '/Home' &&
      loc.pathname !== '/Register' &&
      loc.pathname !== '/RecoverPass')
      if (!localStorage.getItem("jwt"))
        history.push("/Login");
      else {
        fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
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
          .then((json) => {
            dispatch(UiStateSlice.setProfile(json));

            // fetch BookingEntries
            const year = moment(uiState.now).format("YYYY");
            const month = moment(uiState.now).format("MM");
            const daysInMonth = DateUtils.getDaysInMonth(year, month);
            const from = uiState.now + "-01";
            const till = uiState.now + "-" + daysInMonth;
            fetch(`${process.env.REACT_APP_API_URL}/bookingEntries/${json.username}/${from}/${till}`,
              {
                headers: { "auth-token": localStorage.getItem("jwt") },
              })
              .then((response) => {
                if (response.ok) return response.json();
                else throw response;
              })
              .then((json) => dispatch(BookingEntriesSlice.setBookingEntries(json)))
              .catch((error) => {
                if (error.status === 401) {
                  if(loc.pathname !== '/Login') 
                    history.push('/Login');
                } else
                  dispatch(
                    UiStateSlice.setCurrentError(
                      "Fehler! Der Server antwortet nicht."
                    )
                  );
              });
          })
          .catch((error) => {
            if (error.status === 401) {
              history.push('/Login');
            }
            else {
              dispatch(UiStateSlice.setCurrentError('Fehler! Der Server antwortet nicht.'));
            }
          });
      }
  }, [history, loc.pathname, dispatch, uiState.now]);

  return (
    <main>
      <Switch>
        <Route path="/Home">
          <Home />
        </Route>
        <Route path="/TimeBooking">
          <Month />
        </Route>
        <Route path="/Login">
          <Login />
        </Route>
        <Route path="/Register">
          <Register />
        </Route>
        <Route path="/RecoverPass">
          <RecoverPass />
        </Route>
        <Route path="/Profile">
          <Profile />
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
        <Route path="/ConfirmAccount">
          <ConfirmAccount />
        </Route>
      </Switch>
    </main>
  );
}

export default Main;
