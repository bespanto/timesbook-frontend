import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";
import shortid from "shortid";
import { getStatus, getBackground } from "./Utils";
//Material UI
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function RequestVacationCardMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleClick(decision) {
    props.handleVacation(props.vacationId, decision);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={openMenu}>
        <MoreVertIcon />
      </IconButton>
      <Menu id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {props.status === 'pending' ?
          <span>
            <MenuItem onClick={() => handleClick('approved')} style={{ color: '#ffffff' }}>Genehmigen</MenuItem>
            <MenuItem onClick={() => handleClick('rejected')} style={{ color: '#ffffff' }}>Ablehnen</MenuItem>
          </span>
          :
          <MenuItem onClick={() => handleClick('canceled')} style={{ color: '#ffffff' }}>Stornieren</MenuItem>
        }
      </Menu>
    </div>
  );
}


function VacationRequests(props) {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [vacations, setVacations] = useState([]);
  const [filterUsername, setFilterUsername] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [years, setYears] = useState('');
  const [users, setUsers] = useState(new Set([]));
  const classes = useStyles();
  let history = useHistory();
  const loc = useLocation();

  /**
    * 
    */
  function showError(msg) {
    setError(msg);
    setOpenErrorSnackbar(true)
  }

  /**
   * 
   */
  const closeError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorSnackbar(false);
  };


  /**
   * 
   */
  function showSuccess(msg) {
    setSuccess(msg);
    setOpenSuccessSnackbar(true);
  }

  /**
    * 
    */
  const closeSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
  };


  /**
   * 
   */
  const handleChangeFilterUsername = (event) => {
    setFilterUsername(event.target.value);
    fetchVacationData();
  };


  /**
 * 
 */
  const handleChangeFilterYear = (event) => {
    setFilterYear(event.target.value);
    console.log(filterYear)
    fetchVacationData();
  };


  /**
   * 
   */
  function updateVacationStatus(id, decision) {
    const errorMsg = "Der Status konnte nicht geändert werden.";
    fetch(`${process.env.REACT_APP_API_URL}/vacation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'auth-token': localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        status: decision,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showSuccess("Der Status wurde erfolgreich geändert");
          fetchVacationData();
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
  const fetchEmployeeData = useCallback(() => {
    const errorMsg = "Die Benutzerliste kann nicht abgerufen werden.";
    fetch(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        "auth-token": localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success)
          setUsers(new Set(data.success.users));
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
  const fetchVacationData = useCallback(() => {
    let url = `${process.env.REACT_APP_API_URL}/vacation`
    if (filterUsername || filterYear) {
      let serachParams;
      url = url + "?"
      if (filterUsername)
        serachParams = { username: filterUsername };
      if (filterYear) {
        serachParams.from = filterYear + "-01-01";
        serachParams.till = filterYear + "-12-31";
      }

      url = url + new URLSearchParams(serachParams);
    }

    const errorMsg = "Urlaubsdaten können nicht abgefragt werden."
    fetch(url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'auth-token': localStorage.getItem('jwt')
        }
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVacations(data.success);
          setYearRange(data.success);
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
  }, [history, loc.pathname, filterUsername, filterYear]);


  /**
   * 
   */
  useEffect(() => {
    fetchEmployeeData()
  }, [fetchEmployeeData])


  /**
   * 
   */
  useEffect(() => {
    fetchVacationData()
  }, [fetchVacationData])


  /**
   * 
   */
  function getSelectUserElements() {
    const arr = []
    users.forEach((el1, el2, set) => arr.push(<MenuItem key={shortid.generate()} value={el1.username}>{el1.name}</MenuItem>))
    return arr
  }

  /**
   * 
   */
  function getSelectYearElements() {
    const menuItems = [];

    if (years && years.length > 0) {
      let actYear = years[0];
      while (actYear <= years[years.length - 1]) {
        menuItems.push(<MenuItem key={shortid.generate()} value={actYear}>{actYear}</MenuItem>);
        actYear = moment(actYear + "").add(moment.duration({ 'year': 1 })).year();
      }
    }
    return menuItems
  }

  /**
   * 
   * @param {*} users 
   */
  function setYearRange(vacations) {
    const years = new Set();
    vacations.forEach((el) => {
      years.add(moment(el.from).year())
      years.add(moment(el.till).year())
    });
    const yearsArr = Array.from(years).sort((a, b) => a - b);
    setYears(yearsArr);
  }

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="center" style={{ marginBottom: '1em' }}>
        <Typography variant="h5">Urlaubsanträge</Typography>
      </Box>
      <Grid container justify="center" alignItems="center" style={{ marginTop: '1em' }}>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography>Filteroptionen</Typography>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <FormControl className={classes.formControl}>
            <InputLabel id="filterUsername-select-label">Name</InputLabel>
            <Select
              labelId="filterUsername-select-label"
              id="filterUsername-select"
              value={filterUsername}
              onChange={handleChangeFilterUsername}
            >
              <MenuItem value="">
                <em>alle Mitarbeiter</em>
              </MenuItem>
              {getSelectUserElements()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <FormControl className={classes.formControl}>
            <InputLabel id="filterYear-select-label">Jahr</InputLabel>
            <Select
              labelId="filterYear-select-label"
              id="filterYear-select"
              value={filterYear}
              onChange={handleChangeFilterYear}
            >
              <MenuItem value="">
                <em>alle Jahre</em>
              </MenuItem>
              {getSelectYearElements()}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Container style={{ marginTop: "1.5em" }}>
        {vacations.map((row) => (
          <Card key={shortid.generate()} className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" style={{ backgroundColor: getBackground(row.status) }}>
                  <FlightTakeoffIcon />
                </Avatar>
              }
              action={
                (row.status === 'pending' || row.status === 'approved') &&
                <RequestVacationCardMenu status={row.status} handleVacation={updateVacationStatus} vacationId={row._id} />
              }
              title={row.name}
              subheader={moment(row.from).format("DD.MM.YYYY") + " - " + moment(row.till).format("DD.MM.YYYY")}
            />
            <CardContent>
              <Typography color="textSecondary" variant="body2">
                {getStatus(row.status)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Container>
      <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={closeError}>
        <Alert onClose={closeError} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={closeSuccess}>
        <Alert onClose={closeSuccess} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    marginTop: "0.5em",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '15em',
  },
}));

export default VacationRequests;
