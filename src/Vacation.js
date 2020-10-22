import React, { useState } from "react";
import 'date-fns';
import moment from "moment";
import de from "date-fns/locale/de";
import DateFnsUtils from '@date-io/date-fns';
import { DAY_FORMAT } from "./Const";
//Material UI
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
    }
    else
      setError(" 'Ende' kann nicht vor 'Start' liegen");


    setTimeout(() => setError(""), 5000);
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
    </React.Fragment>
  );
}

export default Vacation;
