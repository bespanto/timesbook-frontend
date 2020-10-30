import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
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
  const classes = useStyles();
  const dispatch = useDispatch();
  let history = useHistory();
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));

  function logout() {
    localStorage.removeItem('jwt');
    dispatch(UiStateSlice.setProfile({}));
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
              {uiState.profile &&
                <span>
                  <MenuItem component={Link} to="/TimeBooking" onClick={handleClose} style={{ color: '#ffffff' }}>Zeitbuchungen</MenuItem>
                  <MenuItem component={Link} to="/Vacation" onClick={handleClose} style={{ color: '#ffffff' }}>Urlaub</MenuItem>
                </span>
              }
              {uiState.profile && uiState.profile.role === 'admin' &&
                <span>
                  <Divider />
                  <MenuItem component={Link} to="/Employees" onClick={handleClose} style={{ color: '#ffffff' }}>Mitarbeiter</MenuItem>
                  <MenuItem component={Link} to="/VacationRequests" onClick={handleClose} style={{ color: '#ffffff' }}>Urlaubsanträge</MenuItem>
                  <Divider />
                  <MenuItem component={Link} to="/Profile" onClick={handleClose} style={{ color: '#ffffff' }}>Profil</MenuItem>
                </span>
              }
              <Divider />
              {!uiState.profile && <MenuItem component={Link} to="/Login" onClick={handleClose} style={{ color: '#ffffff' }}>Login</MenuItem>}
            </Menu>
            <Box className={classes.grow} >
              <Button component={Link} to="/home" color="inherit" style={{ textTransform: 'none', color: '#ffffff' }}>
                <Typography variant="h6" >
                  TimesBook
                </Typography>
              </Button>
            </Box>
            {uiState.profile &&
              <React.Fragment>
                <span style={{ textAlign: 'center' }}>
                  <IconButton component={Link} to="/Profile" size="small" style={{ color: '#ffffff' }}>
                    <Person fontSize="large" />
                  </IconButton>
                  <Typography variant="body2">{uiState.profile ? uiState.profile.name : ''}</Typography>
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
