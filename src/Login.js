import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MUILink from "@material-ui/core/Link";

function Login(props) {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const dispatch = useDispatch();
  let history = useHistory();

  /**
   * Handles login event
   */
  function handleLogin() {
    fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: pass }),
    })
      .then(function (response) {
        if (response.ok) return response.json();
        else throw response;
      })
      .then((json) => {
        localStorage.setItem("jwt", json.jwt);
        history.push("/TimeBooking");
      })
      .catch((err) => {
        err
          .json()
          .then((data) => {
            if (data.errorCode === 4003) {
              dispatch(
                UiStateSlice.setCurrentError(
                  "Login ist gescheitert. Der Benutzer '" +
                  username +
                  "' ist nicht registriert."
                )
              );
            } else if (data.errorCode === 4004) {
              dispatch(
                UiStateSlice.setCurrentError(
                  "Login ist gescheitert. Das Passwort ist falsch."
                )
              );
            } else {
              console.log(data);
              dispatch(UiStateSlice.setCurrentError("Login ist gescheitert."));
            }
          })
          .catch((err) => {
            console.log(err);
            dispatch(
              UiStateSlice.setCurrentError(
                "Login ist gescheitert. Serverfehler."
              )
            );
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
        <Grid item>
          <Typography variant="h5">Login</Typography>
        </Grid>
        <Grid item>
          <Typography style={{ color: "red", textAlign: "center" }}>
            {uiState.currentError}
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
        <Grid item style={{ marginTop: "1em" }}>
          <MUILink component={Link} to="/Register" variant="body1">
            Registrieren
          </MUILink>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Login;
