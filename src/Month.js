import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as Utils from "./Utils";
import Day from "./Day";
import shortid from "shortid";
import moment from "moment";
import * as UiStateSlice from "./redux/UiStateSlice";
import { DAY_FORMAT } from "./Const";
// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

function Month(props) {
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const dispatch = useDispatch();

  /**
   *
   */
  function getDayComponents() {
    const daysInMonth = Utils.getDaysInMonth(
      moment(uiState.now).format("YYYY"),
      moment(uiState.now).format("MM")
    );
    let days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const bookingDay = moment(
        uiState.now + "-" + (day <= 9 ? "0" + day : day)
      ).format(DAY_FORMAT);
      days.push(
        <Day
          key={shortid.generate()}
          bookingDay={bookingDay}
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

    const month = moment(uiState.now).subtract(1, "months").format("YYYY-MM");
    dispatch(UiStateSlice.setNow(month));
  }

  /**
   *
   */
  function monthUp(e) {
    e.preventDefault();

    const month = moment(uiState.now).add(1, "months").format("YYYY-MM");
    dispatch(UiStateSlice.setNow(month));
  }

  return (
    <React.Fragment>
      <Grid
        container
        alignItems="center"
        style={{ marginBottom: "1em", marginTop: "1em" }}
      >
        <Grid item xs={3} style={{ textAlign: "right" }}>
          <IconButton size="small" onClick={(e) => monthDown(e)}>
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item xs={6} style={{ textAlign: "center" }}>
          <Typography variant="h5" style={{ textDecoration: "underline" }}>
            {Utils.getMonthName(moment(uiState.now).month())}{" "}
            {moment(uiState.now).year()}
          </Typography>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "left" }}>
          <IconButton size="small" onClick={(e) => monthUp(e)}>
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
      {getDayComponents()}
    </React.Fragment>
  );
}

export default Month;
