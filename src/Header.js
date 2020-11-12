import React, {useCallback, useEffect, useState} from 'react';
import { Link, useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from "@material-ui/core/IconButton";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import Person from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function Header(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const [profile, setProfile] = useState(null);
  const classes = useStyles();
  let history = useHistory();
  const loc = useLocation();


  const fetchProfile = useCallback(() => {
    const errorMsg = "Das Benutzerprofil kann nicht geladen werden.";
    fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
      headers: {
        'auth-token': localStorage.getItem('jwt')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success)
          setProfile(data.success.user);
        else if (data.errorCode === 4007 || data.errorCode === 4008 || data.errorCode === 4009) {
          console.error(errorMsg, data)
          if (loc.pathname !== '/Login')
            history.push('/Login');
        }
        else {
          console.error(errorMsg + " Unerwarteter Fehler.", data)
        }
      })
      .catch((err) => {
        console.error(errorMsg + " Der Server antwortet nicht.", err)
      });
  }, [history, loc.pathname])

  /**
   * 
   */
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, uiState.profileChanged])

  function logout() {
    localStorage.removeItem('jwt');
    setProfile(null);
    history.push('/Login')
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <header>
      <Box className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <IconButton className={classes.menuButton} aria-label="Menu" onClick={handleClick}>
              <MenuIcon />
            </IconButton>
            <Menu id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <MenuItem component={Link} to="/Home" onClick={handleClose} style={{ color: '#ffffff' }}>Home</MenuItem>
              {profile &&
                <span>
                  <MenuItem component={Link} to="/TimeBooking" onClick={handleClose} style={{ color: '#ffffff' }}>Zeitbuchungen</MenuItem>
                  <MenuItem component={Link} to="/Vacation" onClick={handleClose} style={{ color: '#ffffff' }}>Urlaub</MenuItem>
                  <MenuItem component={Link} to="/Overview" onClick={handleClose} style={{ color: '#ffffff' }}>Übersicht</MenuItem>
                </span>
              }
              {profile && profile.role === 'admin' &&
                <span>
                  <Divider />
                  <MenuItem component={Link} to="/Employees" onClick={handleClose} style={{ color: '#ffffff' }}>Mitarbeiter</MenuItem>
                  <MenuItem component={Link} to="/VacationRequests" onClick={handleClose} style={{ color: '#ffffff' }}>Urlaubsanträge</MenuItem>
                  <Divider />
                  <MenuItem component={Link} to="/Profile" onClick={handleClose} style={{ color: '#ffffff' }}>Profil</MenuItem>
                </span>
              }
              {!profile &&
                <span>
                  <Divider />
                  <MenuItem component={Link} to="/Login" onClick={handleClose} style={{ color: '#ffffff' }}>Login</MenuItem>
                </span>
              }
            </Menu>
            <Box className={classes.grow} >
              <Button component={Link} to="/home" color="inherit" style={{ textTransform: 'none', color: '#ffffff' }}>
                <Typography variant="h6" >
                  TimesBook
                </Typography>
              </Button>
            </Box>
            {profile &&
              <React.Fragment>
                <span style={{ textAlign: 'center' }}>
                  <IconButton component={Link} to="/Profile" size="small" style={{ color: '#ffffff' }}>
                    <Person fontSize="large" />
                  </IconButton>
                  <Typography variant="body2">{profile ? profile.name : ''}</Typography>
                </span>
                <IconButton onClick={() => logout()} size="small" style={{ color: '#ffffff' }}>
                  <ExitToAppIcon />
                </IconButton>
              </React.Fragment>
            }
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
}));

export default Header;
