import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
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
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [orga, setOrga] = useState("");
  const [passRepeat, setPassRepeat] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch()
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
  function showSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 5000);
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
        if (data.success){
          setName(data.success.user.name);
          setUsername(data.success.user.username);
          setOrga(data.success.user.organization);
          setRole(data.success.user.role);
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
        console.error(errorMsg + " Der Server antwortet nicht.", err)
        showError(errorMsg + " Der Server antwortet nicht.");

      });

  }, [history, loc.pathname])

  /**
   * 
   */
  function save() {
    const errorMsg = "Das Profil konnte nicht geändert werden.";
    fetch(`${process.env.REACT_APP_API_URL}/user/${username}`, {
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
        if (data.success){
          showSuccess("Das Profil wurde erfolgreich geändert");
          dispatch(UiStateSlice.setProfileChanged(new Date().getTime()))
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
        showError("Passwort muss mind. 6 Zeichen lang sein");
    } else if (pass !== passRepeat)
      showError("Passwörter stimmen nicht überein");
    else {
      const errorMsg = "Das Passwort konnte nicht geändert werden.";
      fetch(`${process.env.REACT_APP_API_URL}/auth/changePass`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'auth-token': localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          password: pass,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showSuccess("Das Passwort wurde erfolgreich geändert");
            setPass("");
            setPassRepeat("")
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
    }
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
  function getRole(r) {
    switch (r) {
      case "admin":
        return "Administrator";
      case "user":
        return "Benutzer";
      default:
        return "";
    }
  }


  /**
   * 
   */
  const getDisabled = val => {
    if (role !== 'admin') return { disabled: true };
    return {};
  };

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
            style={{ marginTop: "1em" }}
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
                {...getDisabled()}
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
                value={getRole(role)}
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
