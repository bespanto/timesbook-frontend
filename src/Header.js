import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import "./App.css";
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from "@material-ui/core/IconButton";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';

function Header(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  let history = useHistory();
  const loc = useLocation();
  const classes = useStyles();
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  useEffect(() => {
    if (loc.pathname !== '/resetPassword') {
      if (!uiState.loggedIn) {
        history.push('/Login');
      }
      else {
        fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
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
            dispatch(UiStateSlice.setProfile(json));
            dispatch(UiStateSlice.setLoggedIn(true));
          })
          .catch((error) => {
            if (error.status === 401) {
              dispatch(UiStateSlice.setLoggedIn(false));
            }
            else {
              dispatch(UiStateSlice.setCurrentError('Fehler! Der Server antwortet nicht.'));
            }
          });
      }
    }
  }, [history, dispatch, uiState.loggedIn, loc.pathname])

  return (
    <header>
      <Box className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={handleClick}>
              <MenuIcon />
            </IconButton>
            <Menu id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              {uiState.loggedIn &&
                <span>
                  <MenuItem component={Link} to="/TimeBooking" onClick={handleClose} style={{ textDecoration: 'none' }}>Zeitbuchungen</MenuItem>
                  <MenuItem component={Link} to="/Vacation" onClick={handleClose}>Urlaub</MenuItem>
                </span>
              }
              <MenuItem component={Link} to="/Login" onClick={handleClose}>{uiState.loggedIn ? 'Profil' : 'Login/Registrieung'}</MenuItem>
              {uiState.loggedIn && uiState.profile.role === 'admin' &&
                <span>
                  <MenuItem component={Link} to="/Employees" onClick={handleClose}>Mitarbeiter</MenuItem>
                  <MenuItem component={Link} to="/VacationRequests" onClick={handleClose}>Urlaubsanträge</MenuItem>
                </span>
              }
            </Menu>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              TimesBook
          </Typography>
            <Typography variant="body2">{uiState.loggedIn ? uiState.profile.name : ''}</Typography>
            <IconButton component={Link} to="/Login" color="inherit">
              <FontAwesomeIcon icon={uiState.loggedIn ? faUser : faUserSlash} />
            </IconButton>
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
