import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { patchData } from "./serverConnections/connect";
import validate from "validate.js";
import * as UiStateSlice from "./redux/UiStateSlice";
import shortid from "shortid";
import "./App.css";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


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

  function getEmployees() {
    const empArr = [
      {
        name: 'Maria Dorsch',
        username: 'm.dorsch@gmail.com',
        status: 'activ'
      },
      {
        name: 'Jan Bartsch',
        username: 'j.bartsch@yahoo.com',
        status: 'activ'
      },
    ]
    let arr = [];
    employees.forEach(item => {
      arr.push(
        <div key={shortid.generate()} className="row section">
          <div className="col">
            <small>{item.name}</small>
          </div>
          <div className="col">
            <small>{item.username}</small>
          </div>
        </div>)
    })
    return arr;
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <Typography>Mitarbeiter</Typography>
        </Grid>
        <Grid item>
          <div className="error">{uiState.currentError}</div>
          <div style={{ color: 'green' }}>{successMsg}</div>
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
          <Button variant="contained" onClick={() => inviteUser()}>
            Default
      </Button>
        </Grid>
      </Grid>
      <Container className={classes.tableContainer}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>E-mail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((row) => (
                <TableRow key={shortid.generate()}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </React.Fragment>
  );
}


const useStyles = makeStyles({
  tableContainer: {
    marginTop: '1em',
  },
  centeredContainer: {
    textAlign: 'center',
  },
  table: {
    // minWidth: 650,
  },
});

export default Admin;
