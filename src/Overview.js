import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";
import shortid from "shortid";
import WorkingModelCard from "./WorkingModelCard";
import FlextimeCorrectionCard from "./FlextimeCorrectionCard"
import * as Utils from "./Utils";
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function Overview(props) {
  const [error, setError] = useState("");
  const [actualFlextime, setActualFlextime] = useState(null);
  const [flextimes, setFlextimes] = useState([]);
  const [remainingVacation, setRemainingVacation] = useState([]);
  const [profile, setProfile] = useState(null);
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
  const fetchActualFlextime = useCallback((username) => {

    const errorMsg = "Die Gleitzeit konnte nicht abgerufen werden.";
    fetch(`${process.env.REACT_APP_API_URL}/bookingEntries/${username}/flextime`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'auth-token': localStorage.getItem('jwt'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success)
          setActualFlextime(data.success.flextime);
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
  }, [history, loc.pathname])

  /**
   *
   */
  useEffect(() => {
    if (profile)
      fetchActualFlextime(profile.username);
  }, [fetchActualFlextime, profile])



  /**
   *
   */
  const fetchRemainingVacation = useCallback((username) => {

    const errorMsg = "Der Resturlaub konnte nicht abgerufen werden.";
    fetch(`${process.env.REACT_APP_API_URL}/vacation/${username}/tillThisYear`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'auth-token': localStorage.getItem('jwt'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success)
          setRemainingVacation(data.success.remainigVacation);
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
  }, [history, loc.pathname])

  /**
   *
   */
  useEffect(() => {
    if (profile)
      fetchRemainingVacation(profile.username);
  }, [fetchRemainingVacation, profile])


  /**
   *
   */
  const fetchFlextimeCorrections = useCallback((username) => {
    const errorMsg = "Die Gleitzeit-Übericht konnte nicht abgerufen werden.";
    fetch(`${process.env.REACT_APP_API_URL}/correction/${username}/flextime`, {
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
  }, [loc.pathname, history])


  /**
       *
       */
  useEffect(() => {
    if (profile)
      fetchFlextimeCorrections(profile.username);
  }, [fetchFlextimeCorrections, profile])


  function getRemainingVacationString(){
    const wholeDays = Math.trunc(remainingVacation);
    const hours = (Math.abs(remainingVacation) - Math.abs(Math.trunc(remainingVacation))) * 24
    const wholeHours = Math.trunc(hours);
    const minutes = (Math.abs(hours) - Math.abs(Math.trunc(hours))) * 60
    const roundedMinutes = Math.round(minutes);

    return `${wholeDays} Tage ${wholeHours} Std. ${roundedMinutes} Min.`;
  }

  return (
    <div className={classes.root}>
      <Grid item>
        <Grid
          container
          spacing={1}
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Typography style={{ color: "red", textAlign: "center" }}>
              {error}
            </Typography>
          </Grid>
          <Grid xs={12} item style={{ textAlign: 'center' }}>
            <Typography variant="h5">Übersicht</Typography>
          </Grid>
          <Grid xs={6} item style={{ textAlign: 'center' }}>
            <Typography variant="caption">Arbeitszeiten sind seit der Registrierung am {profile ? moment(profile.registrationDate).format('DD.MM.YYYY') : '__.__.____'} berücksichtigt</Typography>
          </Grid>
          <Grid xs={12} item style={{ textAlign: 'center' }}>
            <Grid container style={{ marginTop: '0.5em' }}>
              <Grid item xs={12}>
                <Typography display="inline">Gleitzeit: </Typography>
                <Typography display="inline" variant="body2">
                  {actualFlextime ? Utils.minutesToTimeString(actualFlextime) : "--:--"} Std.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography display="inline">Resturlaub: </Typography>
                <Typography display="inline" variant="body2">{getRemainingVacationString()}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container justify="center" style={{ marginTop: '1em' }}>
        <Grid item xs={12}>
          <Typography variant="h6" align={"center"}>Gleitzeit-Korrekturen</Typography>
        </Grid>
        {flextimes && flextimes.length ?
          flextimes.map((element) => {
            return <Grid item xs={11} md={6}>
              <FlextimeCorrectionCard
                key={shortid.generate()}
                id={element._id}
                reason={element.reason}
                date={element.date}
                value={element.value}
              />
            </Grid>
          })
          :
          <Grid item style={{ padding: '0.5em' }}>
            <Typography variant="body2">Keine Korrekturen vorhanden.</Typography>
          </Grid>
        }
      </Grid>


      <Grid container justify="center" style={{ marginTop: '1em' }}>
        <Grid item xs={12}>
          <Typography variant="h6" align={"center"}>Arbeitsmodell</Typography>
        </Grid>
        {profile && profile.workingModels && profile.workingModels.length > 0 ?
          <Grid item xs={11} md={6}>
            {
              profile.workingModels.map((el) => {
                return <WorkingModelCard key={shortid.generate()} workingModel={el} />
              })
            }
          </Grid>
          :
          <Grid item style={{ padding: '0.5em' }}>
            <Typography variant="body2">Sie haben kein Vertragsarbeitsmodell.</Typography>
          </Grid>
        }
      </Grid>



    </div>
  );
}

export default Overview;
