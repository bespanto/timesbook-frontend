import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import shortid from "shortid";
import * as Utils from "./Utils";
import validate from "validate.js";
import FlextimeCorrectionCard from "./FlextimeCorrectionCard"
//Material UI
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


export default function FlextimeCorrection(props) {
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [overtimeCorHours, setOvertimeCorHours] = useState('');
    const [overtimeCorMinutes, setOvertimeCorMinutes] = useState('');
    const [overtimeCorText, setOvertimeCorText] = useState('');
    const [actualFlextime, setActualFlextime] = useState(null);
    const [flextimes, setFlextimes] = useState([]);
    const [showCorrectionForm, setShowCorrectionForm] = useState(false);
    const [error, setError] = useState("");
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
    const fetchActualFlextime = useCallback(() => {

        const errorMsg = "Die Übersicht konnte nicht abgerufen werden.";
        fetch(`${process.env.REACT_APP_API_URL}/bookingEntries/${props.user.username}/flextime`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'auth-token': localStorage.getItem('jwt'),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setActualFlextime(data.success.flextime);
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
    }, [loc.pathname, history, props.user.username])


    /**
     * 
     */
    useEffect(() => {
        fetchActualFlextime();
    }, [fetchActualFlextime])


    /**
     * 
     */
    const fetchFlextimeCorrections = useCallback(() => {
        const errorMsg = "Die Gleitzeit-Übericht konnte nicht abgerufen werden.";
        fetch(`${process.env.REACT_APP_API_URL}/correction/${props.user.username}/flextime`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'auth-token': localStorage.getItem('jwt'),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setFlextimes(data.success.corrections);
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
    }, [loc.pathname, history, props.user.username])


    /**
         * 
         */
    useEffect(() => {
        fetchFlextimeCorrections();
    }, [fetchFlextimeCorrections])

    /**
     * 
     */
    function handleOvertimeCorrectionMinus() {
        if (isCorrectionValid()) {
            const correction = overtimeCorHours * 60 + overtimeCorMinutes * 1;
            saveToBackend(-correction);
        }
    }

    function handleOvertimeCorrectionPlus() {
        if (isCorrectionValid()) {
            const correction = overtimeCorHours * 60 + overtimeCorMinutes * 1;
            saveToBackend(correction);
        }

    }


    /**
     * 
     */
    function saveToBackend(corr) {
        const correction = {
            username: props.user.username,
            type: "flextime",
            value: corr,
            reason: overtimeCorText,
            date: new Date()
        }

        const errorMsg = "Die Gleitzeitkorrektur konnte nicht gespeicheert werden.";
        fetch(`${process.env.REACT_APP_API_URL}/correction`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'auth-token': localStorage.getItem('jwt'),
            },
            body: JSON.stringify(correction)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    return;
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
            .finally(() => {
                fetchFlextimeCorrections();
                fetchActualFlextime()
            })
    }

    /**
     * 
     */
    function isCorrectionValid() {
        var constraints = {
            hours: {
                numericality: {
                    onlyInteger: true,
                    greaterThan: -1,
                }
            },
            minutes: {
                numericality: {
                    onlyInteger: true,
                    greaterThan: -1,
                    lessThanOrEqualTo: 59,
                }
            },
        };

        let valid = false;
        const result = validate(
            { hours: overtimeCorHours, minutes: overtimeCorMinutes },
            constraints
        );
        if (result !== undefined) {
            if (result.hours)
                showError("Für Stunden bitte eine ganze Zahl oder 0 eingeben");
            else if (result.minutes)
                showError("Für Minuten bitte eine ganze Zahl zwischen 0 und 59 eingeben");
        }
        else valid = true;

        return valid;
    }


    /**
    * Sets state for changed fields on tap event
    */
    function handleChange(event) {
        switch (event.target.name) {
            case "overtimeCorHours":
                setOvertimeCorHours(event.target.value);
                break;
            case "overtimeCorMinutes":
                setOvertimeCorMinutes(event.target.value);
                break;
            case "overtimeCorText":
                setOvertimeCorText(event.target.value);
                break;
            default:
                break;
        }
    }


    /**
     * 
     */
    function deleteFlextime(id) {

        const errorMsg = "Die Gleitzeitkorrektur konnte nicht gelöscht werden.";
        fetch(`${process.env.REACT_APP_API_URL}/correction/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'auth-token': localStorage.getItem('jwt'),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success)
                    return
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
            .finally(() => {
                fetchFlextimeCorrections();
                fetchActualFlextime();
            })
    }


    /**
     * 
     */
    function toggleCorrectionForm() {
        setShowCorrectionForm(!showCorrectionForm);
    }

    /**
     * 
     */
    return (
        <React.Fragment>
            <Box display="flex" justifyContent="center" style={{ marginBottom: '1em' }}>
                <Typography variant="h6" style={{ textDecoration: 'underline' }}>Gleitzeit</Typography>
            </Box>
            <Grid container spacing={1} justify="center" alignItems="flex-end" >
                <Grid item>
                    <Typography>Aktuell:</Typography>
                </Grid>
                <Grid item>
                    <Typography>{actualFlextime ? Utils.minutesToTimeString(actualFlextime) : '--:--'} Std.</Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center', marginTop: '1em' }}>
                <Typography>Korrekturen</Typography>
            </Grid>
            <Grid container direction="column" justify="center" >
                {flextimes.map((element) => {
                    return <FlextimeCorrectionCard
                        key={shortid.generate()}
                        id={element._id}
                        reason={element.reason}
                        date={element.date}
                        value={element.value}
                        deleteFlextime={deleteFlextime}
                    />
                })}
            </Grid>
            <Grid container justify="center">
                <IconButton>
                    {showCorrectionForm ?
                        <ExpandLessIcon onClick={() => toggleCorrectionForm()} />
                        :
                        <ExpandMoreIcon onClick={() => toggleCorrectionForm()} />
                    }
                </IconButton>
            </Grid>
            {showCorrectionForm &&
                <Grid container spacing={1} justify="center" alignItems="flex-end" >
                    <Grid item>
                        <TextField
                            id="overtimeCorHours"
                            type="number"
                            label="Std."
                            name="overtimeCorHours"
                            value={overtimeCorHours}
                            onChange={handleChange}
                            style={{ width: '4em' }}
                        />
                    </Grid>
                    <Grid item>
                        :
                </Grid>
                    <Grid item>
                        <TextField
                            id="overtimeCorMinutes"
                            type="number"
                            label="Min."
                            name="overtimeCorMinutes"
                            value={overtimeCorMinutes}
                            onChange={handleChange}
                            style={{ width: '2em' }}
                        />
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <Grid item>
                            <TextField
                                id="overtimeCorText"
                                type="text"
                                label="Grund"
                                name="overtimeCorText"
                                value={overtimeCorText}
                                onChange={handleChange}
                                style={{ width: '10em' }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <Grid item>
                            <IconButton onClick={() => handleOvertimeCorrectionPlus()}>
                                <AddCircleIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={() => handleOvertimeCorrectionMinus()}>
                                <RemoveCircleIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            }
            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={closeError}>
                <Alert onClose={closeError} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}

