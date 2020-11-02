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
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


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
        <MenuItem onClick={() => handleClick('approved')} style={{ color: '#ffffff' }}>Genehmigen</MenuItem>
        <MenuItem onClick={() => handleClick('rejected')} style={{ color: '#ffffff' }}>Ablehnen</MenuItem>
      </Menu>
    </div>
  );
}


function VacationRequests(props) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [vacations, setVacations] = useState([]);
  const classes = useStyles();
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
        if (data.success){
          showSuccess("Der status wurde erfolgreich geändert");
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
  const fetchVacationData = useCallback(() => {
    const errorMsg = "Urlaubsdaten können nicht abgefragt werden."
    fetch(`${process.env.REACT_APP_API_URL}/vacation/byOrga`,
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
          setVacations(data.success.vacations);
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
  }, [history, loc.pathname]);


  /**
   * 
   */
  useEffect(() => {
    fetchVacationData()
  }, [fetchVacationData])

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
      <Box display="flex" justifyContent="center" style={{ marginBottom: '1em' }}>
        <Typography variant="h5">Urlaubsanträge</Typography>
      </Box>


      <Container style={{ marginTop: "1.5em" }}>
        {vacations.map((row) => (
          <Card key={shortid.generate()} className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" style={{backgroundColor: getBackground(row.status)}}>
                  <FlightTakeoffIcon />
                </Avatar>
              }
              action={
                <RequestVacationCardMenu handleVacation={updateVacationStatus} vacationId={row._id} />
              }
              title={row.username}
              subheader={moment(row.from).format("DD.MM.YYYY") + " - " + moment(row.till).format("DD.MM.YYYY")}
            />
            <CardContent>
              <Typography color="textSecondary" variant="body2">
                Status: {getStatus(row.status)}
              </Typography>
            </CardContent>
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
}));

export default VacationRequests;
