import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import validate from "validate.js";
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function Profile(props) {
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const [orga, setOrga] = useState(uiState.profile.organization);
  const [name, setName] = useState(uiState.profile.name);
  const [username, setUsername] = useState(uiState.profile.username);
  const [pass, setPass] = useState("");
  const [passRepeat, setPassRepeat] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const classes = useStyles();

  function save() {
    fetch(`${process.env.REACT_APP_API_URL}/user/${uiState.profile.username}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'auth-token': localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        name: name,
        organization: orga
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success)
          setSuccess("Das Profil wurde erfolgreich geändert");
        else
          setError("Das Profil konnte nicht geändert werden. Serverfehler " + data.errorCode);
      })
      .catch((err) => {
        console.log(err);
        setError("Das Passwort konnte nicht geändert werden. Der Server antwortet nicht.");
      });

    setTimeout(() => setSuccess("",), 5000)
    setTimeout(() => setError("",), 5000)
  }

  /**
 * Sets state for changed fields on tap event
 */
  function handleChange(event) {
    switch (event.target.name) {
      case "pass":
        setPass(event.target.value);
        break;
      case "passRepeat":
        setPassRepeat(event.target.value);
        break;
      case "username":
        setUsername(event.target.value);
        break;
      case "orga":
        setOrga(event.target.value);
        break;
      case "name":
        setName(event.target.value);
        break;
      default:
        break;
    }
  }

  /**
   * 
   */
  function changePass() {
    var constraints = {
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

    // Validate input fields
    const result = validate(
      { pass: pass, passRepeat: passRepeat },
      constraints
    );
    if (result !== undefined) {
      if (result.pass || result.passRepeat)
        setError("Passwort muss mind. 6 Zeichen lang sein");
    } else if (pass !== passRepeat)
      setError("Passwörter stimmen nicht überein");
    else {
      fetch(`${process.env.REACT_APP_API_URL}/user/changePass/${uiState.profile.username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'auth-token': localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          password: pass,
        }),
      })
        .then(function (response) {
          if (response.ok) {
            setSuccess("Das Passwort wurde erfolgreich geändert");
            setPass("");
            setPassRepeat("")
          } else throw response;
        })
        .catch((err) => {
          console.log(err);
          setError("Das Passwort konnte nicht geändert werden. Serverfehler.");
        });
    }
    setTimeout(() => setSuccess(""), 5000);
    setTimeout(() => setError(""), 5000);
  }

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
          <Typography style={{ color: "green", textAlign: "center" }}>
            {success}
          </Typography>
        </Grid>
        <Grid xs={12} item style={{ textAlign: 'center', marginBottom: '0.5em' }}>
          <Typography variant="h5">Benutzerprofil</Typography>
        </Grid>
        <Container>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="pass"
                type="password"
                label="Passwort"
                variant="outlined"
                name="pass"
                value={pass}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="passRepeat"
                type="password"
                label="Passwort wiederh."
                variant="outlined"
                name="passRepeat"
                value={passRepeat}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box
            display="flex"
            justifyContent="center"
            style={{ marginTop: "0.5em" }}
          >
            <Button variant="contained" onClick={() => changePass()}>
              Passwort ändern
          </Button>
          </Box>
        </Container>
        <Grid item xs={12}>
          <Grid
            container
            spacing={1}
            direction="column"
            justify="center"
            alignItems="center"
            style={{ marginTop: '2em' }}
          >
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
                disabled
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
                disabled
                type="role"
                id="role"
                label="Rolle"
                variant="outlined"
                name="role"
                value={uiState.profile.role}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} item style={{ marginTop: '0.5em', textAlign: 'center' }}>
          <Button variant="contained" onClick={() => save()}>
            Speichern
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Profile;
