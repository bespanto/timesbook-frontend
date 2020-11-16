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
import BlockRoundedIcon from '@material-ui/icons/BlockRounded';

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

  const targetDayHours = props.workingModel ? props.workingModel[moment(props.bookingDay).day()] : 0;
  if (bookingEntry !== undefined) {
    start = moment(bookingEntry.start);
    end = moment(bookingEntry.end);
    pause = moment.duration(bookingEntry.pause);
    workingTime = moment.duration(end.diff(start));
    start = start.format(timeFormat);
    end = end.format(timeFormat);
  }
  else {
    if (targetDayHours > 0 && moment().diff(moment(props.bookingDay)) > 0) {
      pause = moment.duration(0);
      workingTime = moment.duration(0);
    }
  }
  if (moment.isDuration(workingTime) && moment.isDuration(pause)) {
    overtime = Utils.minutesToTimeString(workingTime.asMinutes() - pause.asMinutes() - (targetDayHours ? targetDayHours : 0) * 60);
    workingTime = workingTime.asMinutes() !== 0 ? Utils.minutesToTimeString(workingTime.asMinutes() - pause.asMinutes()) : placeholder;
    pause = pause.asMinutes() !== 0 ? Utils.minutesToTimeString(pause.asMinutes()) : placeholder;

  }


  function getBackgroundColor() {

    let color = "#424242"
    if (weekday === 6 || weekday === 0)
      color = "#49516b";
    if (props.vacationDay)
      color = "#3e664d";
    if (props.holiday)
      color = "#993c3c";

    return color;
  }


  return (
    <Container>
      <Paper style={{ backgroundColor: getBackgroundColor() }}>
        <Grid container alignItems="center" style={{ marginTop: '0.5em' }}>
          <Grid item xs={12} style={{ textAlign: 'center', paddingBottom: '1em' }}>
              <Typography variant="h6">{Utils.getWeekday(weekday) + ', ' + moment(props.bookingDay).date() + '.'}</Typography>
              {props.holiday &&
              <Typography variant="caption">{props.holiday}</Typography>}
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

            {props.profile && moment(moment(props.profile.registrationDate).format('YYYY-MM-DD')).isSameOrBefore(props.bookingDay) ?
              <IconButton size="small" onClick={() => handleOpen()}>
                <EditIcon />
              </IconButton>
              : <BlockRoundedIcon />
            }
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', paddingBottom: '0.5em' }}>
            <Typography variant="body2">{activities}</Typography>
          </Grid>
        </Grid>
      </Paper>
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
              profile={props.profile}
            />
          </Box>
        </Fade>
      </Modal>
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
}));

export default Day;
