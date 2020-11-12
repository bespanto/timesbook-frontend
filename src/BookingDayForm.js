import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { patchData, deleteData } from "./serverConnections/connect";
import moment from "moment";
import { DAY_FORMAT } from "./Const";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

function BookingDayForm(props) {
  const loc = useLocation();
  const dispatch = useDispatch();
  let history = useHistory();
  const bookingEntry = useSelector((state) =>
    BookingEntriesSlice.selectBookingEntryByDay(state, props.bookingDay)
  );

  const [start, setStart] = useState(
    bookingEntry === undefined || bookingEntry.start === undefined
      ? ""
      : moment(bookingEntry.start).format("HH:mm")
  );
  const [end, setEnd] = useState(
    bookingEntry === undefined || bookingEntry.end === undefined
      ? ""
      : moment(bookingEntry.end).format("HH:mm")
  );
  const [pause, setPause] = useState(
    bookingEntry === undefined || bookingEntry.pause === undefined
      ? ""
      : bookingEntry.pause
  );
  const [activities, setActivities] = useState(
    bookingEntry === undefined || bookingEntry.activities === undefined
      ? ""
      : bookingEntry.activities
  );
  const [error, setError] = useState("");

  /**
   *
   */
  function saveEntryToBackend(item) {
    const errMsg = "Speichern ist nicht möglich.";
    patchData(
      `${process.env.REACT_APP_API_URL}/bookingEntries/${props.profile.username}`,
      localStorage.getItem("jwt"),
      item
    )
      .then((response) => {
        if (response.status === 401) {
          history.push("/Login");
          throw response;
        }
        else
          return response.json();
      })
      .then((data) => {
        if (data.success) {
          dispatch(BookingEntriesSlice.editBookingEntry(data.success.bookingEntry));
          props.handleClose();
        }
        else if (data.errorCode === 4019) {
          console.error(errMsg + " Fehler: ", data.message);
          setError(errMsg + " Fehler: " + data.message)
        }
        else if (data.errorCode) {
          console.error(errMsg + " Fehler: ", data.errorCode);
          if (loc.pathname !== '/Login')
            history.push('/Login');
        }
        else
          setError(errMsg + " Unerwarteter Fehler.");
      })
      .catch((err) => {
        console.error(err);
        setError(errMsg + " Keine Verbindung zum Server.");
        throw new Exception("ERROR: " + error);
      });
  }

  /**
   *
   */
  function save() {
    const entryToEdit = {
      username: props.profile.username,
      day: moment.utc(props.bookingDay).format(),
      start: new Date(
        moment(props.bookingDay).format(DAY_FORMAT) + "T" + start
      ).toJSON(),
      end: new Date(
        moment(props.bookingDay).format(DAY_FORMAT) + "T" + end
      ).toJSON(),
      pause: pause,
      activities: activities,
    };
    try {
      checkInputs(start, end, pause);
      saveEntryToBackend(entryToEdit);
    } catch (error) {
      setError(error.message);
    }
  }

  /**
   *
   */
  function deleteEntryFromBackend(day) {
    const errMsg = "Löschen ist nicht möglich.";
    deleteData(
      `${process.env.REACT_APP_API_URL}/bookingEntries/${props.profile.username}/${day}`,
      localStorage.getItem("jwt")
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch(BookingEntriesSlice.deleteBookingEntry(day));
          props.handleClose();
        }
        else if (data.errorCode) {
          console.error(errMsg + " Fehler: ", data.errorCode);
          if (loc.pathname !== '/Login')
            history.push('/Login');
        }
        else
          setError(errMsg + " Unerwarteter Fehler.");
      })
      .catch((err) => {
        console.error(err);
        setError(errMsg + "Der Server antwortet nicht.");
      });
  }

  /**
   *
   */
  function Exception(message) {
    this.message = message;
  }

  /**
   *
   */
  function checkInputs(reqStart, reqEnd, reqPause) {
    if (!moment(reqPause, "HH:mm").isValid())
      throw new Exception("'Pause' muss angegeben werden");
    if (!moment(reqStart, "HH:mm").isValid())
      throw new Exception("Keine gültige Eingabe für 'Start'");
    if (!moment(reqEnd, "HH:mm").isValid())
      throw new Exception("Keine gültige Eingabe für  'Ende'");
    const start = moment(reqStart, "HH:mm");
    const end = moment(reqEnd, "HH:mm");
    if (!end.isAfter(start))
      throw new Exception(" 'Ende' kann nicht vor 'Start' liegen");

    const pause = moment.duration(reqPause);
    const workingTime = moment.duration(end.diff(start));
    if (workingTime - pause <= 0)
      throw new Exception("Arbeitszeit muss größer als Pause sein");
  }

  /**
   *
   * @param {*} event
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "start":
        setStart(event.target.value);
        break;
      case "end":
        setEnd(event.target.value);
        break;
      case "pause":
        setPause(event.target.value);
        break;
      case "activities":
        setActivities(event.target.value);
        break;
      default:
        break;
    }
  }

  return (
    <Grid
      container
      spacing={2}
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <Typography style={{ color: "red", textAlign: "center" }}>
          {error}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6">
          {moment(props.bookingDay).format("DD.MM.YYYY")}
        </Typography>
      </Grid>
      <Grid item style={{ marginTop: "0.5em" }}>
        <TextField
          id="start"
          label="Start"
          type="time"
          name="start"
          value={start}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item style={{ marginTop: "0.5em" }}>
        <TextField
          id="ende"
          label="Ende"
          type="time"
          name="end"
          value={end}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item style={{ marginTop: "0.5em" }}>
        <TextField
          id="Pause"
          label="Pause"
          type="time"
          name="pause"
          value={pause}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item style={{ marginTop: "0.5em" }}>
        <TextField
          id="activities"
          label="Tätigkeiten"
          type="text"
          name="activities"
          value={activities}
          onChange={handleChange}
        />
      </Grid>
      <Grid item style={{ marginTop: "0.5em" }}>
        <Button
          variant="contained"
          onClick={() => deleteEntryFromBackend(moment.utc(props.bookingDay).format())}
          style={{ marginRight: "0.5em" }}
        >
          Löschen
        </Button>
        <Button
          variant="contained"
          onClick={(e) => save()}
          style={{ marginLeft: "0.5em" }}
        >
          {props.submitButtonValue}
        </Button>
      </Grid>
    </Grid>
  );
}

export default BookingDayForm;
