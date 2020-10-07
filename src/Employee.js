import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import shortid from "shortid";
import validate from "validate.js";
import { patchData } from "./serverConnections/connect";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

function Admin(props) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [employees, setEmployees] = useState([]);
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const dispatch = useDispatch();
  let history = useHistory();
  const loc = useLocation();
  const classes = useStyles();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        'auth-token': localStorage.getItem('jwt')
      }
    })
      .then((response) => {
        if (response.ok)
          return response.json();
        else
          throw response
      })
      .then((json) => {
        console.log(json);
        setEmployees(json);
      })
      .catch((error) => {
        if (error.status === 401) {
          dispatch(UiStateSlice.setLoggedIn(false));
        }
        else {
          dispatch(UiStateSlice.setCurrentError('Fehler! Der Server antwortet nicht.'));
        }
      });
  }, [history, dispatch, uiState.loggedIn, loc.pathname])


  /**
 * Sets state for changed fields on tap event
 */
  function handleChange(event) {
    switch (event.target.name) {
      case "username":
        setUsername(event.target.value);
        break;
      case "name":
        setName(event.target.value);
        break;
      default:
        break;
    }
  }

  function inviteUser() {

    var constraints = {
      name: {
        presence: true,
        length: {
          minimum: 1,
        },
      },
      username: {
        email: true
      },
    };

    const userInfo = {
      username: username,
      name: name,
      organization: uiState.profile.organization
    }
    // Validate input fields
    const result = validate(userInfo, constraints);
    if (result !== undefined) {
      if (result.name)
        dispatch(UiStateSlice.setCurrentError('Name muss angegeben werden'));
      else
        if (result.username)
          dispatch(UiStateSlice.setCurrentError('Benutzername muss eine gültige E-Mail sein'));
    } else {
      patchData(`${process.env.REACT_APP_API_URL}/user/invite`,
        localStorage.getItem('jwt'),
        userInfo
      )
        .then((response) => {
          if (response.ok)
            return response.json();
          else
            throw response
        })
        .then((json) => {
          dispatch(UiStateSlice.setCurrentError(''));
          setSuccessMsg(`Der Benutzer ${username} wurde erfolgreich eingeladen`);
          setName('');
          setUsername('');
          setTimeout(() => setSuccessMsg(''), 5000);
        })
        .catch((error) => {
          if (error.status === 403) {
            dispatch(UiStateSlice.setCurrentError('Sie sind nicht berechtigt Benutzer einzuladen.'));
          }
          if (error.status === 500) {
            dispatch(UiStateSlice.setCurrentError('Einladen ist fehlgeschlagen. Fehler beim senden der Nachricht.'));
          }
          else {
            console.log(error);
            dispatch(UiStateSlice.setCurrentError('Fehler! Der Server antwortet nicht.'));
          }
        }
        );
    }
    setTimeout(() => dispatch(UiStateSlice.setCurrentError('')), 5000);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Box display="flex" justifyContent="center" style={{ marginBottom: '1em' }}>
        <Typography variant="h5">Mitarbeiter</Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <div className="error">{uiState.currentError}</div>
        <div style={{ color: 'green' }}>{successMsg}</div>
      </Box>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="name"
              label="Name"
              variant="outlined"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} >
            <TextField
              fullWidth
              id="username"
              label="E-Mail"
              variant="outlined"
              name="username"
              value={username}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" style={{ marginTop: '0.5em' }}>
          <Button variant="contained" onClick={() => inviteUser()}>
            Einladen
        </Button>
        </Box>
      </Container>
      <Container style={{marginTop: '1.5em'}}>
        {employees.map((row) => (
          <Card key={shortid.generate()} className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {row.name[0]}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={row.name}
              subheader={row.username}
            />
          </Card>
        ))}
      </Container>
    </React.Fragment>
  );
}

const useStyles = makeStyles({
  card: {
    width: '100%',
    marginTop: '0.5em'
  },
  avatar: {
    backgroundColor: 'blueviolet',
  },
});

export default Admin;
