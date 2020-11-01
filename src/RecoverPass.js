import React, { useState } from "react";
import { Link } from "react-router-dom";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MUILink from "@material-ui/core/Link";

function ForgotPass(props) {
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


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
  function showSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 5000);
  }


  /**
   * Handles login event
   */
  function handleRecoverPass() {
    const errorMsg = "Die Passwortwiederherstellung ist nicht möglich."
    fetch(`${process.env.REACT_APP_API_URL}/auth/recoverPass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success)
          showSuccess("Zum setzen eines neuen Passwortes folgen Sie dem Link in der E-mail, die Sie in Kürze bekommen werden.");
        else if (data.errorCode === 4003)
          showError("Der Benutzer '" + username + "' ist nicht registriert.");
        else {
          console.error(errorMsg + " Unerwarteter Fehler.", data)
          showError(errorMsg + " Unerwarteter Fehler.");
        }
      })
      .catch((err) => {
        console.log(err);
        showError(errorMsg + "Der Server antwortet nicht");
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
          <Typography style={{ color: "red", textAlign: "center" }}>
            {error}
          </Typography>
          <Typography style={{ color: "green", textAlign: "center" }}>
            {success}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">Passwort wiederherstellen</Typography>
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
