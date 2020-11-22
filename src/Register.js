import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import validate from "validate.js";
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

function Register(props) {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [orga, setOrga] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [recaptchaKey, setRecaptchaKey] = useState("");
  const [passRepeat, setPassRepeat] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


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
  function showSuccess(msg) {
    setSuccess(msg);
    setOpenSuccessSnackbar(true);
  }

  /**
    * 
    */
  const closeSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  /**
   * Handles register event
   */
  function handleRegister() {
    var constraints = {
      orga: {
        presence: true,
        length: {
          minimum: 1,
        },
      },
      name: {
        presence: true,
        length: {
          minimum: 1,
        },
      },
      username: {
        email: true,
      },
      pass: {
        presence: true,
        length: {
          minimum: 6,
        },
      },
      passRepeat: {
        presence: true,
        length: {
          minimum: 1,
        },
      },
    };

    const newAdminAccount = {
      orga: orga,
      username: username,
      pass: pass,
      passRepeat: passRepeat,
      name: name,
    };

    // Validate input fields
    const result = validate(newAdminAccount, constraints);
    if (result !== undefined) {
      if (result.orga)
        showError("Organisation muss angegeben werden")
      else if (result.name)
        showError("Name muss angegeben werden");
      else if (result.username)
        showError("Die Benutzername muss eine gültige E-Mail sein");
      else if (result.pass || result.passRepeat)
        showError("Das Passwort muss mind. 6 Zeichen lang sein");
    } else if (pass !== passRepeat)
      showError("Passwörter stimmen nicht überein");
    else {
      const errorMsg = "Registrierung ist nicht möglich.";
      fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: pass,
          name: name,
          organization: orga,
          recaptchaKey: recaptchaKey
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            resetRegisterFields();
            showSuccess("Bitte prüfen Sie Ihre E-Mails und bestätigen Sie die Registrierung.");
          }
          else if (data.errorCode === 4027)
            showError(errorMsg + " reCAPTCHA muss bestätigt werden");
          else if (data.errorCode === 4001) {
            showError(errorMsg + " Der Benutzer '" + newAdminAccount.username + "' existiert bereits.");
          } else if (data.errorCode === 4002)
            showError(errorMsg + " Das Admin-Konto für die Organisation '" + newAdminAccount.orga + "' ist bereits vorhanden.");
          else {
            console.error(errorMsg + " Unerwarteter Fehler.", data)
            showError(errorMsg + " Unerwarteter Fehler.");
          }
        })
        .catch((err) => {
          console.log(errorMsg + " Der Server antwortet nicht.", err);
          showError(errorMsg + " Der Server antwortet nicht.");
        });
    }
  }

  /**
   * Reset all state fields
   */
  function resetRegisterFields() {
    setName("");
    setUsername("");
    setPass("");
    setPassRepeat("");
    setOrga("");
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
      case "orga":
        setOrga(event.target.value);
        break;
      case "name":
        setName(event.target.value);
        break;
      case "passRepeat":
        setPassRepeat(event.target.value);
        break;
      default:
        break;
    }
  }

  function onChange(value) {
    setRecaptchaKey(value);
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
          <Typography variant="h5">Registrieren</Typography>
        </Grid>
        <Grid item>
          <TextField
            id="orga"
            label="Organisation"
            variant="outlined"
            name="orga"
            value={orga}
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            name="name"
            value={name}
            onChange={handleChange}
          />
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
        <Grid item>
          <TextField
            type="password"
            id="passRepeat"
            label="Passwort wiederholen"
            variant="outlined"
            name="passRepeat"
            value={passRepeat}
            onChange={handleChange}
          />
        </Grid>
        <Grid item style={{ marginTop: "0.5em" }}>
          <Button variant="contained" onClick={() => handleRegister()}>
            Senden
          </Button>
        </Grid>
        <Grid item style={{ marginTop: "1em", textAlign: 'center' }}>
          <MUILink component={Link} to="/Login" variant="body1">
            Login
          </MUILink>
          <br />
          <MUILink component={Link} to="/RecoverPass" variant="body1">
            Passwort vergessen
          </MUILink>
        </Grid>
        <Grid item>
          <ReCAPTCHA
            sitekey="6LdvtOcZAAAAADiNtsa6N-4gQoFU1RIpFatGqGMb"
            onChange={onChange}
            theme="dark"
            hl="de"
            size="compact"
          />
        </Grid>
      </Grid>
      <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={closeError}>
        <Alert onClose={closeError} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={closeSuccess}>
        <Alert onClose={closeSuccess} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default Register;
