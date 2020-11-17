import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import de from "date-fns/locale/de";
import DateFnsUtils from '@date-io/date-fns';
import moment from "moment";
import shortid from "shortid";
import { postData } from "./serverConnections/connect";
//Material UI
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function SickDays(props) {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sickTimes, setSickTimes] = useState([]);
  const [sickDayFrom, setSickDayFrom] = useState(new Date());
  const [sickDayTill, setSickDayTill] = useState(new Date());
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState(new Set([]));
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
  const handleChange = (event) => {
    setUsername(event.target.value);
    // fetchVacationData(name);
  };


  /**
   * 
   */
  const fetchEmployeeData = useCallback(() => {
    const errorMsg = "Die Benutzerliste kann nicht abgerufen werden.";
    fetch(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        "auth-token": localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success)
          setUsers(new Set(data.success.users))
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
    fetchEmployeeData()
  }, [fetchEmployeeData])


  const fetchSickTimes = useCallback(() => {
    const errorMsg = "Die Krankheitstage können nicht abgerufen werden.";
    fetch(`${process.env.REACT_APP_API_URL}/sickTime`, {
      headers: {
        "auth-token": localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success)
          setSickTimes(data.success)
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
  }, [loc.pathname, history])


  useEffect(() => {
    fetchSickTimes()
  }, [fetchSickTimes])


  function deleteSickTime(id) {
    const errorMsg = "Die Krankheitsperiode konnte nicht gelöscht werden."
    fetch(`${process.env.REACT_APP_API_URL}/sickTime/${id}`,
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
          showSuccess("Die Krankheitsperiode wurde erfolgreich gelöscht");
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
      })
      .finally(()=>fetchSickTimes())
  }

  function saveSickTime() {
    const start = moment(sickDayFrom);
    const end = moment(sickDayTill);
    if (username === "")
      showError("Sie müssen eienen Mitarbeiter auswählen.")
    else {
      if (end.isSameOrAfter(start)) {
        const errorMsg = "Die Krankheitsperiode konnte nicht erstellt werden.";
        postData(`${process.env.REACT_APP_API_URL}/sickTime/`,
          localStorage.getItem('jwt'),
          {
            username: username,
            from: sickDayFrom.toISOString().slice(0, 10),
            till: sickDayTill.toISOString().slice(0, 10)
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              showSuccess("Die Krankheitsperiode wurde erfolgreich erstellt.");
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
          })
          .finally(() => fetchSickTimes())
      }
      else
        showError(" 'Ende' kann nicht vor 'Start' liegen");
    }
  }

  function getSelectElements() {
    const arr = []
    users.forEach((el1, el2, set) => arr.push(<MenuItem key={shortid.generate()} value={el1.username}>{el1.name}</MenuItem>))
    return arr
  }

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="center" style={{ marginBottom: '1em' }}>
        <Typography variant="h5">Krankheitstage</Typography>
      </Box>
      <Box display="flex" justifyContent="center" style={{ marginBottom: '1em' }}>
        <FormControl className={classes.formControl}>
          <InputLabel id="name-select-label">Name</InputLabel>
          <Select
            labelId="name-select-label"
            id="name-select"
            value={username}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>alle Mitarbeiter</em>
            </MenuItem>
            {getSelectElements()}
          </Select>
        </FormControl>
      </Box>
      <Container>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de} >
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd.MM.yyyy"
              margin="normal"
              id="sickDayFrom"
              label="Vom"
              value={sickDayFrom}
              onChange={(date) => setSickDayFrom(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd.MM.yyyy"
              margin="normal"
              id="sickDayTill"
              label="Bis"
              value={sickDayTill}
              onChange={(date) => setSickDayTill(date)}
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
          <Button variant="contained" onClick={() => saveSickTime()}>
            Speichern
          </Button>
        </Box>
      </Container>
      <Container style={{ marginTop: "1.5em" }}>
        {sickTimes && sickTimes.map((row) => (
          <Card key={shortid.generate()} className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" style={{ backgroundColor: 'red' }}>
                  <LocalHospitalIcon />
                </Avatar>
              }
              action={
                <IconButton aria-label="settings" onClick={() => deleteSickTime(row._id)}>
                  <DeleteIcon />
                </IconButton>
              }
              title={Array.from(users).filter(el => el.username === row.username)[0].name}
              subheader={moment(row.from).format('DD.MM.YYYY') + "-" + moment(row.till).format('DD.MM.YYYY')}
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: '15em',
  },
}));

export default SickDays;
