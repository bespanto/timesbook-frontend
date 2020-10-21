import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MUILink from "@material-ui/core/Link";

function ForgotPass(props) {
  const [username, setUsername] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const dispatch = useDispatch();

  /**
   * Handles login event
   */
  function handleRecoverPass() {
    fetch(`${process.env.REACT_APP_API_URL}/auth/recoverPass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    })
      .then(function (response) {
        if (response.ok) return response.json();
        else throw response;
      })
      .then((json) => {
        setSuccessMsg("Zum setzen eines neuen Passwortes folgen Sie dem Link in der E-mail, die Sie in Kürze bekommen werden.");
      })
      .catch((err) => {
        err
          .json()
          .then((data) => {
            if (data.errorCode === 4003) {
              dispatch(
                UiStateSlice.setCurrentError("Der Benutzer '" + username + "' ist nicht registriert."));
            } else
              console.log(data)
          })
          .catch((err) => {
            console.log(err);
            dispatch(UiStateSlice.setCurrentError("Die Passwortwiederherstellung ist gescheitert. Serverfehler"));
          });
      });
    setTimeout(() => dispatch(UiStateSlice.setCurrentError("")), 5000);
  }

  /**
   * Sets state for changed fields on tap event
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "username":
        setUsername(event.target.value);
        break;
      default:
        break;
    }
  }

  /**
   * Render output
   */
  return (
    <React.Fragment>
      <Grid
        container
        spacing={1}
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h5">Passwort wiederherstellen</Typography>
        </Grid>
        <Grid item>
          <Typography style={{ color: "red", textAlign: "center" }}>
            {uiState.currentError}
          </Typography>
          <Typography style={{ color: "green", textAlign: "center" }}>
            {successMsg}
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            id="username"
            label="E-Mail"
            variant="outlined"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </Grid>
        <Grid item style={{ marginTop: "0.5em" }}>
          <Button variant="contained" onClick={() => handleRecoverPass()}>
            Senden
          </Button>
        </Grid>
        <Grid item style={{ marginTop: "1em", textAlign: 'center' }}>
          <MUILink component={Link} to="/Register" variant="body1">
            Registrieren
          </MUILink>
          <br />
          <MUILink component={Link} to="/Login" variant="body1">
            Login
          </MUILink>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ForgotPass;