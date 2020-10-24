import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import shortid from "shortid";
import validate from "validate.js";
import { patchData, deleteData } from "./serverConnections/connect";
import * as UiStateSlice from "./redux/UiStateSlice";
//Material UI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from "@material-ui/core/Modal";
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import WarningIcon from '@material-ui/icons/Warning';

function Admin(props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  let history = useHistory();
  const loc = useLocation();

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        "auth-token": localStorage.getItem("jwt"),
      },
    })
      .then((response) => {
        if (response.status === 401)
          history.push('/Login');
        else
          return response.json();
      })
      .then((json) => setEmployees(json))
      .catch((err) => {
        console.log(err)
        setError("Die Benutzerliste kann nicht abgerufen werden. Der Server antwortet nicht.");
      });
  });

  /**
   * 
   */
  function inviteUser() {
    var constraints = {
      name: {
        presence: true,
        length: {
          minimum: 1,
        },
      },
      username: {
        email: true,
      },
    };

    const userInfo = {
      username: username,
      name: name,
      organization: uiState.profile.organization,
    };
    // Validate input fields
    const result = validate(userInfo, constraints);
    if (result !== undefined) {
      if (result.name)
        setError("Name muss angegeben werden");
      else if (result.username)
        setError("Benutzername muss eine gültige E-Mail sein");
    } else {
      setLoading(true);
      patchData(
        `${process.env.REACT_APP_API_URL}/user/invite`,
        localStorage.getItem("jwt"),
        userInfo
      )
        .then((response) => {
          if (response.status === 403)
            setError("Sie sind nicht berechtigt Benutzer einzuladen.");
          else
            return response.json();
        })
        .then((data) => {
          if (data.success) {
            setError("");
            setSuccess(`Der Benutzer ${username} wurde erfolgreich eingeladen`);
            setName("");
            setUsername("");
            setTimeout(() => setSuccess(""), 5000);
          }
          else
            if (data.errorCode === 5002)
              setError("Der Benutzer konnte nicht eingeladen werden. Interner Serverfehler: E-Mail-Error.");
            else
              if (data.errorCode === 5001)
                setError("Der Benutzer konnte nicht eingeladen werden. Interner Serverfehler: DB-Error");

        })
        .catch((error) => {
          console.log(error);
          setError("Der Benutzer konnte nicht eingeladen werden. Der Server antwortet nicht.");
        })
        .finally(() => { setLoading(false) });
    }
    setTimeout(() => setError(""), 5000);
  }

  /**
   * 
   */
  function deleteUser(username) {
    setLoading(true);
    deleteData(
      `${process.env.REACT_APP_API_URL}/user/${username}`,
      localStorage.getItem("jwt"),
    )
      .then((response) => {
        if (response.status === 401) {
          history.push('/Login');
        } else
          return response.json();
      })
      .then(() => {
        setSuccess("Der Benutzer '" + username + "' wurde erfolgreich aus Ihrer Organisation entfernt")
        setTimeout(() => setSuccess(""), 5000);
      })
      .catch((error) => {
        console.log(error)
        setError("Fehler beim entfernen des Benutzers.");
      })
      .finally(() => { setLoading(false) });

    handleClose();
  }

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="center">
        <Typography style={{ color: "red", textAlign: "center" }}>
          {error}
        </Typography>
        <Typography style={{ color: "green", textAlign: "center" }}>
          {success}
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        style={{ marginBottom: "1em" }}
      >
        <Typography variant="h5">Mitarbeiter</Typography>
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
          <Grid item xs={6}>
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
        <Box
          display="flex"
          justifyContent="center"
          style={{ marginTop: "0.5em" }}
        >
          <Button variant="contained" onClick={() => inviteUser()}>
            Einladen
          </Button>
        </Box>
      </Container>
      <Container style={{ marginTop: "1.5em" }}>
        {employees.map((row) => (
          <Card key={shortid.generate()} className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {row.name[0]}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings" onClick={handleOpen}>
                  <DeleteIcon />
                </IconButton>
              }
              title={row.name}
              subheader={row.username}
            />
            <Modal
              style={{ marginLeft: '1em', marginRight: '1em' }}
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <Box className={classes.paper} style={{ textAlign: 'center' }}>
                  <WarningIcon fontSize="large" />
                  <Typography style={{ marginTop: '1em' }}>Durch diese Aktion löschen Sie unwiederruflich den Benutzer und alle seine Buchungen.</Typography>
                  <Container style={{ textAlign: 'center', marginTop: '1em' }}>
                    <Button variant="contained" onClick={() => deleteUser(row.username)}>Löschen</Button>
                  </Container>
                </Box>
              </Fade>
            </Modal>
          </Card>
        ))}
      </Container>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    marginTop: "0.5em",
  },
  avatar: {
    backgroundColor: "blueviolet",
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    color: '#f57c00',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default Admin;
