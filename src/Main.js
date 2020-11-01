import React, { useCallback, useEffect, useState } from "react";
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
//Material UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

function Main(props) {
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  let history = useHistory();
  const loc = useLocation();


  /**
   * 
   */
  function showError(msg) {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  }


  /**
   * 
   */
  const fetchData = useCallback(() => {
    if (loc.pathname !== "/ResetPassword" &&
      loc.pathname !== '/confirmAccount' &&
      loc.pathname !== '/Home' &&
      loc.pathname !== '/Register' &&
      loc.pathname !== '/RecoverPass')
      if (!localStorage.getItem("jwt"))
        history.push("/Login");
      else {
        const errorMsg = "Das Benutzerprofil kann nicht geladen werden.";
        fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
          headers: {
            'auth-token': localStorage.getItem('jwt')
          }
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              dispatch(UiStateSlice.setProfile(data.success.user));

              // fetch BookingEntries
              const year = moment(uiState.now).format("YYYY");
              const month = moment(uiState.now).format("MM");
              const daysInMonth = DateUtils.getDaysInMonth(year, month);
              const from = uiState.now + "-01";
              const till = uiState.now + "-" + daysInMonth;

              const errorMsg = "Zeitbuchungen können nicht abgefragt werden.";
              fetch(`${process.env.REACT_APP_API_URL}/bookingEntries/${data.success.user.username}/${from}/${till}`,
                {
                  headers: { "auth-token": localStorage.getItem("jwt") },
                })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success)
                    dispatch(BookingEntriesSlice.setBookingEntries(data.success.bookingEntries));
                  else if (data.errorCode === 4007 || data.errorCode === 4008 || data.errorCode === 4009) {
                    console.error(errorMsg, data)
                    if (loc.pathname !== '/Login')
                      history.push('/Login');
                  }
                  else {
                    console.error(errorMsg + " Unerwarteter Fehler.", data)
                    showError(errorMsg + " Unerwarteter Fehler.");
                  }
                })
                .catch((err) => {
                  console.error(errorMsg + " Der Server antwortet nicht.", err)
                  showError(errorMsg + " Der Server antwortet nicht.");
                });
              //end fetch BookingEntries
            }
            else if (data.errorCode === 4007 || data.errorCode === 4008 || data.errorCode === 4009) {
              dispatch(UiStateSlice.setProfile(null));
              console.error(errorMsg, data)
              if (loc.pathname !== '/Login')
                history.push('/Login');
            }
            else {
              console.error(errorMsg + " Unerwarteter Fehler.", data)
              showError(errorMsg + " Unerwarteter Fehler.");
            }
          })
          .catch((err) => {
            console.error(errorMsg + " Der Server antwortet nicht.", err)
            showError(errorMsg + " Der Server antwortet nicht.");

          });
      }
  }, [history, loc.pathname, dispatch, uiState.now]);


  /**
   * 
   */
  useEffect(() => {
    fetchData()
  }, [fetchData]);

  return (
    <main>
      <Box display="flex" justifyContent="center">
        <Typography style={{ color: "red", textAlign: "center" }}>
          {error}
        </Typography>
      </Box>
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
