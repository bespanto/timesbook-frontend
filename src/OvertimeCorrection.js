import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import * as Utils from "./Utils";
//Material UI
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

export default function OvertimeCorrection(props) {
    const [overtimeCorHours, setOvertimeCorHours] = useState('');
    const [overtimeCorMinutes, setOvertimeCorMinutes] = useState('');
    const [overtimeCorText, setOvertimeCorText] = useState('');
    const [overview, setOverview] = useState(null);
    const [error, setError] = useState("");
    let history = useHistory();
    const loc = useLocation();

    /**
     * 
     */
    const fetchOverview= useCallback((username) => {

        const errorMsg = "Die Übersicht konnte nicht abgerufen werden.";
        fetch(`${process.env.REACT_APP_API_URL}/user/${username}/overview`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('jwt'),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              setOverview(data.success.overview);
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
    }, [loc.pathname, history])

    /**
     * 
     */
    useEffect(() => {
        fetchOverview(props.user.username);
    }, [fetchOverview, props.user.username])

    /**
     * 
     */
    function showError(msg) {
        setError(msg);
        setTimeout(() => setError(""), 5000);
    }

    function handleOvertimeCorrection() {
        console.log('handleOvertimeCorrection');
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
    return (
        <React.Fragment>
            <Box display="flex" justifyContent="center">
                <Typography style={{ color: "red", textAlign: "center" }}>
                    {error}
                </Typography>
            </Box>
            <Box display="flex" justifyContent="center" style={{ marginBottom: '1em' }}>
                <Typography variant="h6" style={{ textDecoration: 'underline' }}>Überstunden-Korrektur</Typography>
            </Box>
            <Grid container spacing={1} justify="center" alignItems="flex-end" >
                <Grid item>
                    <Typography>Aktuell:</Typography>
                </Grid>
                <Grid item>
                    <Typography>{overview ? Utils.minutesToTimeString(overview.overtimeAsMinutes) : '--:--'} Std.</Typography>
                </Grid>
            </Grid>
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
                        <IconButton onClick={() => handleOvertimeCorrection()}>
                            <AddCircleIcon fontSize="large" />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => handleOvertimeCorrection()}>
                            <RemoveCircleIcon fontSize="large" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
