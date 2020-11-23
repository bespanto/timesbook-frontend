import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MUILink from "@material-ui/core/Link";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Login(props) {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  let history = useHistory();
  const dispatch = useDispatch()

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
   * Handles login event
   */
  function handleLogin() {
    const errorMsg = "Login ist gescheitert.";
    fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: pass
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          localStorage.setItem("jwt", data.success.jwt);
          dispatch(UiStateSlice.setProfileChanged(new Date().getTime()));
          history.push("/TimeBooking");
        }
        else if (data.errorCode === 4027)
          showError(errorMsg + " reCAPTCHA muss bestätigt werden");
        else if (data.errorCode === 4003) {
          showError(errorMsg + " Der Benutzer '" + username + "' ist nicht registriert.");
        } else if (data.errorCode === 4004) {
          showError(errorMsg + " Das Passwort ist falsch.");
        } else if (data.errorCode === 4011) {
          showError("Das Konto ist noch nicht bestätigt. Bitte prüfen Sie Ihr E-Mails und schließen Sie die Registrierung ab.");
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

  /**
   * Sets state for changed fields on tap event
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "username":
        setUsername(event.target.value);
        break;
      case "pass":
        setPass(event.target.value);
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
        <Grid item style={{paddingTop: '1em', paddingBottom: '1em'}}>
          <Typography variant="h5">Login</Typography>
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
        <Grid item>
          <TextField
            type="password"
            id="pass"
            label="Passwort"
            variant="outlined"
            name="pass"
            value={pass}
            onChange={handleChange}
          />
        </Grid>
        <Grid item style={{ marginTop: "0.5em" }}>
          <Button variant="contained" onClick={() => handleLogin()}>
            Senden
          </Button>
        </Grid>
        <Grid item style={{ marginTop: "1em", textAlign: 'center' }}>
          <MUILink component={Link} to="/Register" variant="body1">
            Registrieren
          </MUILink>
          <br />
          <MUILink component={Link} to="/RecoverPass" variant="body1">
            Passwort vergessen
          </MUILink>
        </Grid>
      </Grid>
      <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={closeError}>
        <Alert onClose={closeError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default Login;
