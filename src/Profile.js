import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function Profile(props) {
  let history = useHistory();
  const classes = useStyles();
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));

  function logout() {
    localStorage.removeItem('jwt');
    history.push('/Login')
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.root}>
        <Grid
          container
          spacing={1}
          justify="center"
          alignItems="center"
        >
          <Grid xs={12} item style={{ textAlign: 'center', marginBottom: '0.5em' }}>
            <Typography variant="h5">Benutzerprofil</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box style={{ marginLeft: '1em', marginRight: '1em' }}>
              <List className={classes.root}>
                <ListItem>
                  <ListItemText primary="Name" secondary={uiState.profile.name} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Benutzername" secondary={uiState.profile.username} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Organisation" secondary={uiState.profile.organization} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Role" secondary={uiState.profile.role} />
                </ListItem>
                <Divider />
              </List>
            </Box>
          </Grid>
          <Grid xs={12} item style={{ marginTop: '0.5em', textAlign: 'center' }}>
            <Button variant="contained" onClick={() => logout()}>
              Logout
            </Button>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default Profile;
