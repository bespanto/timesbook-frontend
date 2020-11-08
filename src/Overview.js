import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import shortid from "shortid";
import * as UiStateSlice from "./redux/UiStateSlice";
import WorkingModelCard from "./WorkingModelCard";
import * as Utils from "./Utils";
import { getProfile } from "./serverConnections/connect";
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
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const [error, setError] = useState("");
  const [overview, setOverview] = useState({});
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

  const getOverviewData = useCallback(async () => {

    const user = await getProfile();

    const errorMsg = "Die Übersicht konnte nicht abgerufen werden.";
    fetch(`${process.env.REACT_APP_API_URL}/user/${user.username}/overview`, {
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
  }, [history, loc.pathname])

  useEffect(() => {
    getOverviewData();
  }, [getOverviewData])


  return (
    <div className={classes.root}>
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
        <Grid xs={12} item style={{ textAlign: 'center' }}>
          <Grid container style={{ marginTop: '0.5em' }}>
            <Grid item xs={6}>
              <Typography display="inline">Gleitzeit: </Typography>
              <Typography display="inline" variant="body2">{Utils.minutesToTimeString(overview.overtimeAsMinutes)} Std.</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography display="inline">Resturlaub: </Typography>
              <Typography display="inline" variant="body2">8 Tage</Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid xs={12} item style={{ textAlign: 'center' }}>
          <Grid container style={{ marginTop: '1em' }}>
          <Grid item item xs={12}>
              <Typography variant="h6">Gleitzeit-Korrekturen</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography display="inline">Gleitzeit: </Typography>
              <Typography display="inline" variant="body2">20 Std.</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography display="inline">Resturlaub: </Typography>
              <Typography display="inline" variant="body2">8 Tage</Typography>
            </Grid>
          </Grid>
        </Grid> */}
        {
          uiState.profile && uiState.profile.workingModels && uiState.profile.workingModels.length > 0 &&
          <Grid
            container
            spacing={1}
            direction="column"
            justify="center"
            alignItems="center"
            style={{ marginTop: '1em' }}
          >

            <Grid item>
              <Typography variant="h6">Arbeitsmodell</Typography>
            </Grid>
            <Grid item>
              {
                uiState.profile.workingModels.map((el) => {
                  return <WorkingModelCard key={shortid.generate()} workingModel={el} />
                })
              }
            </Grid>
          </Grid>
        }
      </Grid>
    </div>
  );
}

export default Overview;
