import React, { useState } from "react";
import { Link } from "react-router-dom";
import validate from "validate.js";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MUILink from "@material-ui/core/Link";

function Register(props) {
  const [orga, setOrga] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [passRepeat, setPassRepeat] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
        setError("Organisation muss angegeben werden")
      else if (result.name)
        setError("Name muss angegeben werden");
      else if (result.username)
        setError("Die Benutzername muss eine gültige E-Mail sein");
      else if (result.pass || result.passRepeat)
        setError("Das Passwort muss mind. 6 Zeichen lang sein");
    } else if (pass !== passRepeat)
      setError("Passwörter stimmen nicht überein");
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
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            resetRegisterFields();
            setSuccess(errorMsg + " Bitte prüfen Sie Ihre E-Mails und bestätigen Sie die Registrierung.");
            setTimeout(() => setSuccess(""), 5000);
          }
          else if (data.errorCode === 4001) {
            setError(errorMsg + " Der Benutzer '" + newAdminAccount.username + "' existiert bereits.");
          } else if (data.errorCode === 4002)
            setError(errorMsg + " Das Admin-Konto für die Organisation '" + newAdminAccount.orga + "' ist bereits vorhanden.");
          else
            setError(errorMsg + " Unerwarteter Fehler.");
        })
        .catch((err) => {
          console.log(err);
          setError(errorMsg + " Der Server antwortet nicht.");
        });
      setTimeout(() => setError(""), 5000);
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
      </Grid>
    </React.Fragment>
  );
}

export default Register;
