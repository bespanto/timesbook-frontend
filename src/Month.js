import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as DateUtils from "./DateUtils";
import Day from "./Day";
import Popup from "./Popup";
import BookingDayForm from "./BookingDayForm";
import shortid from "shortid";
import "./App.css";
import moment from "moment";
import * as UiStateSlice from "./redux/UiStateSlice";
import { DAY_FORMAT } from "./Const";
// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

function Month(props) {
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const [bookingDateToEdit, setBookingDateToEdit] = useState('');
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const dispatch = useDispatch();

  /**
   * 
   */
  function getDayComponents() {
    const daysInMonth = DateUtils.getDaysInMonth(moment(uiState.now).format('YYYY'), moment(uiState.now).format('MM'));
    let days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const bookingDay = moment(uiState.now + '-' + (day <= 9 ? '0' + day : day)).format(DAY_FORMAT);
      days.push(
        <Day
          key={shortid.generate()}
          bookingDay={bookingDay}
          showPopup={showPopup}
        />
      );
    }
    return days;
  }

  /**
   * 
   */
  function monthDown(e) {
    e.preventDefault();

    const month = moment(uiState.now).subtract(1, 'months').format('YYYY-MM');
    dispatch(UiStateSlice.setNow(month));
  }

  /**
   * 
   */
  function monthUp(e) {
    e.preventDefault();

    const month = moment(uiState.now).add(1, 'months').format('YYYY-MM');
    dispatch(UiStateSlice.setNow(month));
  }

  /**
   * 
   */
  function showPopup(date) {
    setBookingDateToEdit(date);
    setPopupIsVisible(true);
  }

  /**
   * 
   */
  function closePopup() {
    setPopupIsVisible(false);
  }

  /**
 * 
 */
  function closeErrorPopup() {
    dispatch(UiStateSlice.setCurrentError(''));
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container alignItems="center" style={{ marginBottom: '1em', marginTop: '1em' }}>
        <Grid item xs={3} style={{ textAlign: 'right' }}>
          <IconButton size="small" onClick={(e) => monthDown(e)}>
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'center' }} >
          <Typography variant="h5" style={{ textDecoration: 'underline' }}>
            {DateUtils.getMonthName(moment(uiState.now).month())} {moment(uiState.now).year()}
          </Typography>
        </Grid>
        <Grid item xs={3} style={{ textAlign: 'left' }} >
          <IconButton size="small" onClick={(e) => monthUp(e)}>
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
      {getDayComponents()}
      {popupIsVisible && (
        <Popup handleClose={closePopup}>
          <BookingDayForm
            bookingDay={bookingDateToEdit}
            submitButtonValue="Speichern"
            handleClose={closePopup}
          />
        </Popup>
      )}
      {uiState.currentError !== '' &&
        <Popup handleClose={closeErrorPopup}>
          <Box style={{ marginLeft: '0.75em', marginRight: '0.75em', marginBottom: '2em', marginTop: '1em' }}>
            <Typography className="error">{uiState.currentError}</Typography>
          </Box>
        </Popup>
      }
    </React.Fragment>
  );
}

export default Month;
