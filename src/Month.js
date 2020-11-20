import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as Utils from "./Utils";
import Day from "./Day";
import shortid from "shortid";
import moment from "moment";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import * as UiStateSlice from "./redux/UiStateSlice";
import { DAY_FORMAT } from "./Const";
// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function Month(props) {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const [profile, setProfile] = useState(null);
  const [vacations, setVacations] = useState(null);
  const [sickTimes, setSickTimes] = useState(null);
  const [holidays, setHolidays] = useState(null);
  const [username, setUsername] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  let history = useHistory();
  const loc = useLocation();

  const year = moment(uiState.now).format("YYYY");
  const month = moment(uiState.now).format("MM");
  const daysInMonth = Utils.getDaysInMonth(year, month);
  const from = uiState.now + "-01";
  const till = uiState.now + "-" + daysInMonth;


  /**
   * 
   */
  function showError(msg) {
    setError(msg);
    setOpenErrorSnackbar(true)
  }

  /**
   * 
   */
  const closeError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorSnackbar(false);
  };


  /**
  * 
  */
  useEffect(() => {
    const errorMsg = "Das Benutzerprofil kann nicht geladen werden.";
    fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
      headers: {
        'auth-token': localStorage.getItem('jwt')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsername(data.success.user.username);
          setProfile(data.success.user);
        }
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
  }, [history, loc.pathname])



  const fetchBookEntries = useCallback(() => {

    const errorMsg = "Zeitbuchungen können nicht abgefragt werden.";
    fetch(`${process.env.REACT_APP_API_URL}/bookingEntries/${username}/${from}/${till}`,
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
  }, [history, loc.pathname, dispatch, username, from, till])

  /**
   * 
   */
  useEffect(() => {
    fetchBookEntries()
  }, [fetchBookEntries]);


  /**
  * 
  */
  useEffect(() => {
    if (profile) {
      const searchParams = new URLSearchParams({
        username: profile.username,
        from: from,
        till: till
      });
      const url = `${process.env.REACT_APP_API_URL}/vacation?` + searchParams;
      const errorMsg = "Urlaubsdaten können nicht geladen werden."
      fetch(url, {
        headers: {
          'auth-token': localStorage.getItem('jwt')
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setVacations(data.success);
          }
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
    }
  }, [history, loc.pathname, from, till, profile])

  /**
  * 
  */
  useEffect(() => {
    const errorMsg = "Feiertage können nicht geladen werden.";
    fetch(`${process.env.REACT_APP_HOLIDAY_API_URL}/?jahr=${moment(uiState.now).format("YYYY")}`)
      .then((response) => response.json())
      .then((data) => {
        setHolidays(data);
      })
      .catch((err) => {
        console.error(errorMsg + " Der Server antwortet nicht.", err)
        showError(errorMsg + " Der Server antwortet nicht.");

      });
  }, [history, loc.pathname, uiState.now])


  /**
  * 
  */
  useEffect(() => {
    if (profile) {
      const errorMsg = "Krankheitstage können nicht geladen werden.";
      let url = `${process.env.REACT_APP_API_URL}/sickTime/${profile.username}`
      url = url + "?" + new URLSearchParams({ from: from, till: till })
      fetch(url, {
        headers: {
          'auth-token': localStorage.getItem('jwt')
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setSickTimes(data.success);
          }
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
    }
  }, [history, loc.pathname, from, till, profile])



  /**
   * 
   */
  function isSickDay(day) {
    if (sickTimes)
      for (let index = 0; index < sickTimes.length; index++) {
        const sickTime = sickTimes[index];
        if (moment(day).isBetween(sickTime.from, sickTime.till, 'day', '[]'))
          return true;
      }
    return false
  }

  /**
   * 
   */
  function getHoliday(day) {
    if (holidays)
      for (const key in holidays['NATIONAL']) {
        if (holidays['NATIONAL'].hasOwnProperty(key)) {
          const element = holidays['NATIONAL'][key];
          if (moment(day).isSame(element.datum, 'day'))
            return key;
        }
      }
    return null
  }

  /**
   * 
   */
  function isVacationDay(day) {
    if (vacations)
      for (let index = 0; index < vacations.length; index++) {
        const vacation = vacations[index];
        if (moment(day).isBetween(vacation.from, vacation.till, 'day', '[]') && vacation.status === 'approved')
          return true;
      }
    return false
  }

  /**
   *
   */
  function getDayComponents() {
    const daysInMonth = Utils.getDaysInMonth(
      moment(uiState.now).format("YYYY"),
      moment(uiState.now).format("MM")
    );
    let days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const bookingDay = moment(uiState.now + "-" + (day <= 9 ? "0" + day : day)).format(DAY_FORMAT);
      const workingModel = getTargetWorkingModel(bookingDay);
      days.push(
        <Day
          key={shortid.generate()}
          workingModel={workingModel}
          bookingDay={bookingDay}
          profile={profile}
          vacationDay={isVacationDay(bookingDay)}
          holiday={getHoliday(bookingDay)}
          sickDay={isSickDay(bookingDay)}
        />
      );
    }
    return days;
  }

  /**
   *
   */
  function monthDown(e) {
    e.preventDefault();

    const month = moment(uiState.now).subtract(1, "months").format("YYYY-MM");
    dispatch(UiStateSlice.setNow(month));
  }

  /**
   *
   */
  function monthUp(e) {
    e.preventDefault();

    const month = moment(uiState.now).add(1, "months").format("YYYY-MM");
    dispatch(UiStateSlice.setNow(month));
  }


  /**
   * 
   */
  function getTargetWorkingModel(startTime) {

    let targetWorkingModel;
    if (profile) {
      const models = profile.workingModels;
      if (models && models.length > 0) // mind. ein Arbeitsmodell definiert
        if (models.length === 1) {
          if (moment(models[0].validFrom).isSameOrBefore(moment(startTime)))
            targetWorkingModel = models[0];
        }
        else if (models.length > 1) {
          for (let index = 0; index < models.length - 1; index++) {
            if (moment(startTime).isBetween(models[index].validFrom, models[index + 1].validFrom, undefined, '[)'))
              targetWorkingModel = models[index];
            else if (index + 1 === models.length - 1)
              if (moment(startTime).isSameOrAfter(moment(models[index + 1].validFrom)))
                targetWorkingModel = models[index + 1];

          }
        }
    }
    return targetWorkingModel;
  }

  return (
    <React.Fragment>
      <Grid
        container
        alignItems="center"
        style={{ marginBottom: "1em", marginTop: "1em" }}
      >
        <Grid item xs={3} style={{ textAlign: "right" }}>
          <IconButton size="small" onClick={(e) => monthDown(e)}>
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item xs={6} style={{ textAlign: "center" }}>
          <Typography variant="h5" style={{ textDecoration: "underline" }}>
            {Utils.getMonthName(moment(uiState.now).month())}{" "}
            {moment(uiState.now).year()}
          </Typography>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "left" }}>
          <IconButton size="small" onClick={(e) => monthUp(e)}>
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
      {getDayComponents()}
      <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={closeError}>
        <Alert onClose={closeError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default Month;
