import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import validate from "validate.js";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";
// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

function Login(props) {
  const [orga, setOrga] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [passRepeat, setPassRepeat] = useState('');
  const [registerMode, setRegisterMode] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const dispatch = useDispatch();
  let history = useHistory();

  /**
   * Handles login event
   */
  function handleLogin() {
    fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: pass }),
    })
      .then(function (response) {
        if (response.ok)
          return response.json();
        else
          throw response
      }).then(json => {
        localStorage.setItem('jwt', json.jwt)
        dispatch(UiStateSlice.setLoggedIn(true));
        history.push('/TimeBooking');
      })
      .catch((err) => {
        if (err.status === 400)
          dispatch(UiStateSlice.setCurrentError('Login ist gescheitert'));
        else
          dispatch(UiStateSlice.setCurrentError('Serveranfrage ist gescheitert'));
      });
    setTimeout(() => dispatch(UiStateSlice.setCurrentError('')), 5000);
  }

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
        email: true
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

    // Validate input fields
    const result = validate({ orga: orga, username: username, pass: pass, passRepeat: passRepeat, name: name }, constraints);
    if (result !== undefined) {
      if (result.orga)
        dispatch(UiStateSlice.setCurrentError('Organisation muss angegeben werden'));
      else
        if (result.name)
          dispatch(UiStateSlice.setCurrentError('Name muss angegeben werden'));
        else
          if (result.username)
            dispatch(UiStateSlice.setCurrentError('Benutzername muss eine gültige E-Mail sein'));
          else
            if (result.pass || result.passRepeat)
              dispatch(UiStateSlice.setCurrentError('Passwort muss mind. 6 Zeichen lang sein'));
    }
    else
      if (pass !== passRepeat)
        dispatch(UiStateSlice.setCurrentError('Passwörter stimmen nicht überein'));
      else {
        fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username, password: pass, name: name, organization: orga }),
        })
          .then(function (response) {
            if (response.ok) {
              resetRegisterFields();
              setSuccessMsg('Registrierung erfolgreich');
              setTimeout(() => setSuccessMsg(''), 5000);
              setRegisterMode(false);
            }
            else
              throw response
          })
          .catch((err) => {
            dispatch(UiStateSlice.setCurrentError('Registrierung ist nicht möglich.'));
          });
      }
    setTimeout(() => dispatch(UiStateSlice.setCurrentError('')), 5000);
  }

  /**
   * Reset all state fields
   */
  function resetRegisterFields() {
    setName('');
    setUsername('');
    setPass('');
    setPassRepeat('');
    setOrga('');
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
      <CssBaseline />
      <Grid container spacing={1} direction="column" justify="center" alignItems="center">
        <Grid item>
          {registerMode ?
            <Typography variant="h6">Registrieren</Typography>
            :
            <Typography variant="h6">Login</Typography>
          }
        </Grid>
        <Grid item>
          <div className="error">{uiState.currentError}</div>
          <div style={{ color: 'green' }}>{successMsg}</div>
        </Grid>
        {registerMode &&
          <Grid item>
            <TextField
              id="orga"
              label="Organisation"
              variant="outlined"
              name="orga"
              value={orga}
              onChange={handleChange}
            />
          </Grid>}
        {registerMode &&
          <Grid item>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </Grid>}
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
        {registerMode &&
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
          </Grid>}
        <Grid item style={{ marginTop: '0.5em' }}>
          {registerMode ?
            <Button variant="contained" onClick={() => handleRegister()}>
              Senden
            </Button>
            :
            <Button variant="contained" onClick={() => handleLogin()}>
              Senden
            </Button>
          }
        </Grid>
        <Grid item style={{ marginTop: '1em' }}>
          {registerMode ?
            <Link component="button" variant="body2" onClick={() => setRegisterMode(false)}>
              Login
            </Link>
            :
            <Link component="button" variant="body2" onClick={() => setRegisterMode(true)}>
              Registrieren
          </Link>
          }
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Login;
