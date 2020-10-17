import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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

function Header(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));

  useEffect(() => {
    // refresh the AppBar
  }, [uiState.profile])


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
              <MenuItem component={Link} to="/Home" onClick={handleClose}>Home</MenuItem>
              {localStorage.getItem('jwt') &&
                <span>
                  <MenuItem component={Link} to="/TimeBooking" onClick={handleClose} style={{ textDecoration: 'none' }}>Zeitbuchungen</MenuItem>
                  <MenuItem component={Link} to="/Vacation" onClick={handleClose}>Urlaub</MenuItem>
                </span>
              }
              {localStorage.getItem('jwt') && uiState.profile.role === 'admin' &&
                <span>
                  <Divider />
                  <MenuItem component={Link} to="/Employees" onClick={handleClose}>Mitarbeiter</MenuItem>
                  <MenuItem component={Link} to="/VacationRequests" onClick={handleClose}>Urlaubsanträge</MenuItem>
                  <Divider />
                  <MenuItem component={Link} to="/Profile" onClick={handleClose}>Profil</MenuItem>
                </span>
              }
              {!localStorage.getItem('jwt') && <MenuItem component={Link} to="/Login" onClick={handleClose}>Login/Registrieung</MenuItem>}
            </Menu>
            <Typography variant="h6" color="inherit" className={classes.grow} style={{ marginLeft: '1em' }}>
              TimesBook
            </Typography>
            {localStorage.getItem('jwt') &&
              <span style={{ textAlign: 'center' }}>
                <IconButton component={Link} to="/Profile" size="small">
                  <Person fontSize="large" />
                </IconButton>
                <Typography variant="body2">{uiState.profile.name}</Typography>
              </span>
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
