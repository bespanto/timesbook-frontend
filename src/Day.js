import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import BookingDayForm from "./BookingDayForm";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import * as Utils from "./Utils";
import "./App.css";
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import Modal from "@material-ui/core/Modal";
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';

function Day(props) {
  const bookingEntry = useSelector((state) =>
    BookingEntriesSlice.selectBookingEntryByDay(state, props.bookingDay)
  );
  const classes = useStyles();
  const weekday = moment(props.bookingDay).weekday();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const timeFormat = 'HH:mm';
  const placeholder = '--:--';
  let start = placeholder;
  let end = placeholder;
  let pause = placeholder;
  let workingTime = placeholder;
  let overtime = placeholder;
  const activities = bookingEntry === undefined ? '' : bookingEntry.activities;

  if (bookingEntry !== undefined) {
    start = moment(bookingEntry.start);
    end = moment(bookingEntry.end);
    pause = moment.duration(bookingEntry.pause);
    workingTime = moment.duration(end.diff(start));
    start = start.format(timeFormat);
    end = end.format(timeFormat);
    overtime = Utils.minutesToTimeString(workingTime.asMinutes() - pause.asMinutes() - 8 * 60);
    workingTime = Utils.minutesToTimeString(workingTime.asMinutes() - pause.asMinutes());
    pause = Utils.minutesToTimeString(pause.asMinutes());
  }

  return (
    <Container>
      <Paper style={weekday === 6 || weekday === 0 ? {backgroundColor: '#49516b'} : {backgroundColor: '#424242'} }>
        <Grid container alignItems="center" style={{ marginTop: '0.5em' }}>
          <Grid item xs={12} style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <Typography variant="h6">{Utils.getWeekday(weekday) + ', ' + moment(props.bookingDay).date() + '.'}</Typography>
          </Grid>
          <Grid container>
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Typography variant="caption">Start</Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Typography variant="caption">Ende</Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Typography variant="caption">Pause</Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Typography variant="caption">Ist</Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Typography variant="caption">+/-</Typography>
            </Grid>
          </Grid>
          <Grid item xs={2} className={classes.bookingRow}>
            <Typography variant="body2">{start}</Typography></Grid>
          <Grid item xs={2} className={classes.bookingRow}>
            <Typography variant="body2">{end}</Typography></Grid>
          <Grid item xs={2} className={classes.bookingRow}>
            <Typography variant="body2">{pause}</Typography></Grid>
          <Grid item xs={2} className={classes.bookingRow}>
            <Typography variant="body2">{workingTime}</Typography></Grid>
          <Grid item xs={2} className={classes.bookingRow}>
            <Typography variant="body2">{overtime}</Typography></Grid>
          <Grid item xs={2} style={{ textAlign: 'center' }} >
            <IconButton size="small" onClick={() => handleOpen()}>
              <EditIcon />
            </IconButton>
            <Modal
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
                <Box className={classes.paper}>
                  <BookingDayForm
                    bookingDay={props.bookingDay}
                    submitButtonValue="Speichern"
                    handleClose={handleClose}
                  />
                </Box>
              </Fade>
            </Modal>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', paddingBottom: '0.5em' }}>
            <Typography variant="body2">{activities}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  bookingRow: {
    borderRight: '1px solid',
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  headerEmptySpace: {
    flexGrow: 1,
  },
}));

export default Day;
