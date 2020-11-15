import React, { useState } from 'react';
import moment from "moment";
import de from "date-fns/locale/de";
import DateFnsUtils from '@date-io/date-fns';
import shortid from "shortid";
import validate from "validate.js";
//Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default function WorkingModelForm(props) {
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [monday, setMonday] = useState(8);
    const [thuesday, setThuesday] = useState(8);
    const [wednesday, setWednesday] = useState(8);
    const [thursday, setThursday] = useState(8);
    const [friday, setFriday] = useState(8);
    const [saturday, setSaturday] = useState(0);
    const [validFrom, setValidFrom] = useState(new Date());
    const [vacationEntitlement, setVacationEntitlement] = useState(20);
    const classes = useStyles();
  
  
    /**
     * 
     */
    function showError(msg) {
        setError(msg);
        setOpenSnackbar(true)
    }

    const closeError = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackbar(false);
      };
    /**
     * 
     */
    function handleWorkingModel() {
        const workingModel = {
            1: monday,
            2: thuesday,
            3: wednesday,
            4: thursday,
            5: friday,
            6: saturday,
            vacationEntitlement: vacationEntitlement,
            validFrom: moment(moment(validFrom).format('YYYY-MM-DD')),
        }
        if(isVacationEntitlementValid())
        props.saveWorkingModel(workingModel);
    }

    /**
      * 
      */
    function isVacationEntitlementValid() {
        var constraints = {
            days: {
                numericality: {
                    onlyInteger: true,
                    greaterThan: -1,
                    lessThanOrEqualTo: 199,
                }
            },
        };

        let valid = false;
        const result = validate({ days: vacationEntitlement }, constraints);
        if (result !== undefined) {
            if (result.days)
                showError("Urlaubsanspruch muss 0 bis 199 Tage betragen.");
        }
        else valid = true;

        return valid;
    }


    /**
    * 
    */
    const handleChange = (event) => {
        switch (event.target.name) {
            case "monday":
                setMonday(event.target.value);
                break;
            case "thuesday":
                setThuesday(event.target.value);
                break;
            case "wednesday":
                setWednesday(event.target.value);
                break;
            case "thursday":
                setThursday(event.target.value);
                break;
            case "friday":
                setFriday(event.target.value);
                break;
            case "saturday":
                setSaturday(event.target.value);
                break;
            case "vacationEntitlement":
                setVacationEntitlement(event.target.value);
                break;
            default:
                break;
        }
    };

    function getSelectElements() {
        const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const arr = []
        hours.forEach((el) => arr.push(<MenuItem key={shortid.generate()} value={el}>{el}</MenuItem>))
        return arr
    }


    return (
        <div>
            <Box display="flex" justifyContent="center">
                <Typography>Neues Arbeitsmodell</Typography>
            </Box>
            <Grid container spacing={3} justify="center" style={{ marginTop: '0.5em' }}>
                <Grid item>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="monday-select-label">Montag</InputLabel>
                        <Select
                            labelId="monday-select-label"
                            id="monday-select"
                            name="monday"
                            value={monday}
                            onChange={handleChange}
                        >
                            {getSelectElements()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="monday-select-label">Dienstag</InputLabel>
                        <Select
                            labelId="thuesday-select-label"
                            id="thuesday-select"
                            name="thuesday"
                            value={thuesday}
                            onChange={handleChange}
                        >
                            {getSelectElements()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="wednesday-select-label">Mittwoch</InputLabel>
                        <Select
                            labelId="wednesday-select-label"
                            id="wednesday-select"
                            name="wednesday"
                            value={wednesday}
                            onChange={handleChange}
                        >
                            {getSelectElements()}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={3} justify="center">
                <Grid item>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="thursday-select-label">Donnerstag</InputLabel>
                        <Select
                            labelId="thursday-select-label"
                            id="thursday-select"
                            name="thursday"
                            value={thursday}
                            onChange={handleChange}
                        >
                            {getSelectElements()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="friday-select-label">Freitag</InputLabel>
                        <Select
                            labelId="friday-select-label"
                            id="friday-select"
                            name="friday"
                            value={friday}
                            onChange={handleChange}
                        >
                            {getSelectElements()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="saturday-select-label">Samstag</InputLabel>
                        <Select
                            labelId="saturday-select-label"
                            id="saturday-select"
                            name="saturday"
                            value={saturday}
                            onChange={handleChange}
                        >
                            {getSelectElements()}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: '1em' }}>
                <Grid item>
                    <TextField
                        id="vacationEntitlement"
                        type="number"
                        label="Urlaubsanspruch im Jahr"
                        name="vacationEntitlement"
                        value={vacationEntitlement}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
            <Grid container direction="column" alignItems="center">
                <Grid item>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de} >
                        <KeyboardDatePicker
                            className={classes.datePicker}
                            disableToolbar
                            variant="inline"
                            format="dd.MM.yyyy"
                            margin="normal"
                            id="validFrom"
                            label="Gültig ab"
                            value={validFrom}
                            onChange={(date) => setValidFrom(date)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={() => handleWorkingModel()}>
                        Übernehmen
                    </Button>
                </Grid>
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={closeError}>
                <Alert onClose={closeError} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: '4em',
    },
    datePicker: {
        width: '10em',
    },
}));
