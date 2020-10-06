import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import moment from "moment";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import * as DateUtils from "./DateUtils";
import "./App.css";
// Material UI
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";

function Day(props) {
  const bookingEntry = useSelector((state) =>
    BookingEntriesSlice.selectBookingEntryByDay(state, props.bookingDay)
  );
  const weekday = moment(props.bookingDay).weekday();

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
    overtime = DateUtils.minutesToTimeString(workingTime.asMinutes() - pause.asMinutes() - 8 * 60);
    workingTime = DateUtils.minutesToTimeString(workingTime.asMinutes() - pause.asMinutes());
    pause = DateUtils.minutesToTimeString(pause.asMinutes());
  }

  return (
    <div className={weekday === 6 || weekday === 0 ? 'text-muted' : ''}>

      <Grid container alignItems="center" style={{ border: '2px solid blueviolet', marginTop: '0.5em' }}>
        <Grid item xs={12} style={{ textAlign: 'center', paddingBottom: '1em' }}>
          <Typography variant="button">{DateUtils.getWeekday(weekday) + ', ' + moment(props.bookingDay).date() + '.'}</Typography>
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
        <Grid item xs={2} style={{ textAlign: 'center', borderRight: '1px solid blueviolet' }}>
          <Typography variant="body2">{start}</Typography></Grid>
        <Grid item xs={2} style={{ textAlign: 'center', borderRight: '1px solid blueviolet' }} >
          <Typography variant="body2">{end}</Typography></Grid>
        <Grid item xs={2} style={{ textAlign: 'center', borderRight: '1px solid blueviolet' }} >
          <Typography variant="body2">{pause}</Typography></Grid>
        <Grid item xs={2} style={{ textAlign: 'center', borderRight: '1px solid blueviolet' }} >
          <Typography variant="body2">{workingTime}</Typography></Grid>
        <Grid item xs={2} style={{ textAlign: 'center', borderRight: '1px solid blueviolet' }}>
          <Typography variant="body2">{overtime}</Typography></Grid>
        <Grid item xs={2} style={{ textAlign: 'center' }} >
          <button className="button" onClick={() => props.showPopup(props.bookingDay)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography variant="body2">{activities}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default Day;
