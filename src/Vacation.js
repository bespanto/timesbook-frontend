import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import 'date-fns';
import moment from "moment";
import shortid from "shortid";
import de from "date-fns/locale/de";
import DateFnsUtils from '@date-io/date-fns';
import { postData } from "./serverConnections/connect";
import { getStatus, getBackground } from "./Utils";
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Vacation(props) {
  const [showForm, setShowForm] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [vacationFrom, setVacationFrom] = useState(new Date());
  const [vacationTill, setVacationTill] = useState(new Date());
  const [vacations, setVacations] = useState([]);
  const classes = useStyles();
  let history = useHistory();
  const loc = useLocation();

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
  function showSuccess(msg) {
    setSuccess(msg);
    setOpenSuccessSnackbar(true);
  }

  /**
    * 
    */
  const closeSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
  };


  /**
   * 
   */
  function toggleForm() {
    setShowForm(!showForm);
  }

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
        if (data.success)
          setProfile(data.success.user);
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
  const fetchVacationData = useCallback(() => {
    if (profile) {
      const errorMsg = "Urlaubsdaten können nicht abgefragt werden."
      const url = `${process.env.REACT_APP_API_URL}/vacation?` + new URLSearchParams({ username: profile.username });;
      fetch(url,
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
          console.error(errorMsg + " Der Server antwortet nicht.", err);
          showError(errorMsg + " Der Server antwortet nicht.");
        });
    }
  }, [history, loc.pathname, profile]);


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
      postData(`${process.env.REACT_APP_API_URL}/vacation/${profile.username}`,
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


  return (
    <React.Fragment>
      <Box display="flex" justifyContent="center">
        <Typography variant="h5">Urlaub</Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <IconButton size="small">
          {showForm ?
            <ExpandLessIcon onClick={() => toggleForm()} />
            :
            <ExpandMoreIcon onClick={() => toggleForm()} />
          }
        </IconButton>
      </Box>
      { showForm && <Container>
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
      </Container>}
      <Container style={{ marginTop: "1.5em" }}>
        {vacations.map((row) => (
          <Card key={shortid.generate()} className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" style={{ backgroundColor: getBackground(row.status) }}>
                  <FlightTakeoffIcon />
                </Avatar>
              }
              action={
                row.status === 'pending' &&
                <IconButton aria-label="settings" onClick={() => deleteVacation(row._id)}>
                  <DeleteIcon />
                </IconButton>
              }
              title={moment(row.from).format("DD.MM.YYYY") + " - " + moment(row.till).format("DD.MM.YYYY")}
              subheader={getStatus(row.status)}
            />
          </Card>
        ))}
      </Container>
      <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={closeError}>
        <Alert onClose={closeError} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={closeSuccess}>
        <Alert onClose={closeSuccess} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}


const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    marginTop: "0.5em",
  },
}));

export default Vacation;
