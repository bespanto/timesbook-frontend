import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import 'date-fns';
import moment from "moment";
import shortid from "shortid";
import de from "date-fns/locale/de";
import DateFnsUtils from '@date-io/date-fns';
import { postData } from "./serverConnections/connect";
import * as UiStateSlice from "./redux/UiStateSlice";
//Material UI
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function Vacation(props) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [vacationFrom, setVacationFrom] = useState(new Date());
  const [vacationTill, setVacationTill] = useState(new Date());
  const [vacations, setVacations] = useState([]);
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const classes = useStyles();
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
  function showSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 5000);
  }


  /**
   * 
   */
  const fetchVacationData = useCallback(() => {
    const errorMsg = "Urlaubsdaten können nicht abgefragt werden."
    fetch(`${process.env.REACT_APP_API_URL}/vacation/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'auth-token': localStorage.getItem('jwt')
        }
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVacations(data.success.vacations);
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
        console.error(errorMsg + " Der Server antwortet nicht.", err);
        showError(errorMsg + " Der Server antwortet nicht.");
      });
  }, [history, loc.pathname]);


  /**
   * 
   */
  useEffect(() => {
    fetchVacationData()
  }, [fetchVacationData])


  /**
   * 
   */
  function requestVacation() {
    const start = moment(vacationFrom);
    const end = moment(vacationTill);
    if (end.isSameOrAfter(start)) {
      const errorMsg = "Die Urlaubsanfrage konnte nicht erstellt werden.";
      postData(`${process.env.REACT_APP_API_URL}/vacation/${uiState.profile.username}`,
        localStorage.getItem('jwt'),
        {
          from: vacationFrom.toISOString().slice(0, 10),
          till: vacationTill.toISOString().slice(0, 10)
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            showSuccess("Ihre Urlaubsanfrage wurde erfolgreich eingereicht.");
            fetchVacationData();
          }
          else if (data.errorCode === 4007 || data.errorCode === 4008 || data.errorCode === 4009) {
            console.error(errorMsg, data)
            if (loc.pathname !== '/Login')
              history.push('/Login');
          }
          else if (data.errorCode === 4015)
            showError("Ihr Urlaubswusch überschneidet sich mit einer anderen Urlaubsperiode.");
          else {
            console.error(errorMsg + " Unerwarteter Fehler.", data)
            showError(errorMsg + " Unerwarteter Fehler.");
          }
        })
        .catch((err) => {
          console.error(errorMsg + " Der Server antwortet nicht.", err);
          showError(errorMsg + " Der Server antwortet nicht.");
        })
    }
    else
      showError(" 'Ende' kann nicht vor 'Start' liegen");
  }


  /**
   * 
   */
  function deleteVacation(id) {
    const errorMsg = "Der Urlaubseintrag konnte nicht gelöscht werden."
    fetch(`${process.env.REACT_APP_API_URL}/vacation/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'auth-token': localStorage.getItem('jwt')
        }
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showSuccess("Der Urlaubseintrag wurde erfolgreich gelöscht");
          fetchVacationData();
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
        console.error(errorMsg + " Der Server antwortet nicht.", err);
        showError(errorMsg + " Der Server antwortet nicht.");
      });
  }


  /**
   * 
   */
  function getStatus(status) {
    switch (status) {
      case "pending":
        return "beantragt";
      default:
        return '';
    }
  }

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="center">
        <Typography style={{ color: "red", textAlign: "center" }}>
          {error}
        </Typography>
        <Typography style={{ color: "green", textAlign: "center" }}>
          {success}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" style={{ marginBottom: '1em' }}>
        <Typography variant="h5">Urlaub</Typography>
      </Box>
      <Container>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de} >
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd.MM.yyyy"
              margin="normal"
              id="vacationFrom"
              label="Vom"
              value={vacationFrom}
              onChange={(date) => setVacationFrom(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd.MM.yyyy"
              margin="normal"
              id="vacationTill"
              label="Bis"
              value={vacationTill}
              onChange={(date) => setVacationTill(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Box
          display="flex"
          justifyContent="center"
          style={{ marginTop: "0.5em" }}
        >
          <Button variant="contained" onClick={() => requestVacation()}>
            Einreichen
          </Button>
        </Box>
      </Container>
      <Container style={{ marginTop: "1.5em" }}>
        {vacations.map((row) => (
          <Card key={shortid.generate()} className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  <FlightTakeoffIcon />
                </Avatar>
              }
              action={
                <IconButton aria-label="settings" onClick={() => deleteVacation(row._id)}>
                  <DeleteIcon />
                </IconButton>
              }
              title={moment(row.from).format("DD.MM.YYYY") + " - " + moment(row.till).format("DD.MM.YYYY")}
              subheader={"Status: " + getStatus(row.status)}
            />
          </Card>
        ))}
      </Container>
    </React.Fragment>
  );
}


const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    marginTop: "0.5em",
  },
  avatar: {
    backgroundColor: "blueviolet",
  },
}));

export default Vacation;
