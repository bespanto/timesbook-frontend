import React, {useState, useEffect, useCallback} from "react";
import { useSelector } from "react-redux";
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
  const classes = useStyles();
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));

  const handleVacationFrom = (date) => {
    setVacationFrom(date);
  };

  const handleVacationTill = (date) => {
    setVacationTill(date);
  };

  function requestVacation() {
    const start = moment(vacationFrom);
    const end = moment(vacationTill);
    if (end.isSameOrAfter(start)) {
      console.log("from: " + vacationFrom.toISOString().slice(0, 10));
      console.log("till: " + vacationTill.toISOString().slice(0, 10));
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
            setSuccess("Ihre Urlaubsanfrage wurde erfolgreich eingereicht.");
          }
          else if (data.errorCode)
            setError("Die Urlaubsanfrage konnte nicht erstellt werden. Serverfehler " + data.errorCode);

        })
        .catch((err) => {
          console.log(err);
          setError("Die Urlaubsanfrage konnte nicht verarbeitet werden. Der Server antwortet nicht.");
        })

    }
    else
      setError(" 'Ende' kann nicht vor 'Start' liegen");

    setTimeout(() => setError(""), 5000);
    setTimeout(() => setSuccess(""), 5000);
  }

  const innerFunction = useCallback(() => {
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
            console.log(data.success.vacations);
          }
          else if (data.errorCode)
            setError("Urlaubsdaten können nicht geholt werden. Serverfehler " + data.errorCode);

        })
        .catch((err) => {
          console.log(err);
          setError("Urlaubsdaten können nicht geholt werden. Der Server antwortet nicht");
        });

  },[]);

  useEffect(() => {
    innerFunction()
  }, [innerFunction])

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
              onChange={handleVacationFrom}
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
              onChange={handleVacationTill}
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
      <Container style={{ textAlign: 'center', marginTop: '2em' }}>
        <Typography variant="h6">Eingereichte Urlaubsanträge</Typography>
      </Container>
      <Container style={{ marginTop: "1.5em" }}>
        {/* {vacations.map((row) => (
          <Card key={shortid.generate()} className={classes.card}>
            <CardHeader
              action={
                <IconButton aria-label="settings">
                  <DeleteIcon />
                </IconButton>
              }
              title={row.from + "-" + row.till}
              subheader={"Status: " + row.status}
            />
          </Card>
        ))} */}
      </Container>
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
