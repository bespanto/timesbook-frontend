import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as Utils from "./Utils";
import Day from "./Day";
import shortid from "shortid";
import moment from "moment";
import * as UiStateSlice from "./redux/UiStateSlice";
import { DAY_FORMAT } from "./Const";
// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

function Month(props) {
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const [profile, setProfile] = useState(null);
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
  const fetchProfile = useCallback(() => {

    const errorMsg = "Das Benutzerprofil kann nicht geladen werden.";
    fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
      headers: {
        'auth-token': localStorage.getItem('jwt')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
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


  /**
   * 
   */
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile])

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
      const bookingDay = moment(
        uiState.now + "-" + (day <= 9 ? "0" + day : day)
      ).format(DAY_FORMAT);
      const workingModel = getTargetWorkingModel(bookingDay);
      days.push(
        <Day
          key={shortid.generate()}
          workingModel={workingModel}
          bookingDay={bookingDay}
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
        <Grid item>
          <Typography style={{ color: "red", textAlign: "center" }}>
            {error}
          </Typography>
        </Grid>
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
    </React.Fragment>
  );
}

export default Month;
