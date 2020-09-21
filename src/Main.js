import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import TabPanel from "./TabPanel";
import Month from "./Month";
import "./App.css";
import * as UiStateSlice from "./redux/UiStateSlice";
import * as BookingEntriesSlice from "./redux/BookingEntriesSlice";
import { USERNAME, HOST } from "./Const";
import Login from "./Login";
import Profile from "./Profile";
import Admin from "./Admin";
import moment from "moment";
import * as DateUtils from "./DateUtils";

function Main(props) {
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state))
  const dispatch = useDispatch();

  const fetchData = useCallback(() => {
    const year = moment(uiState.now).format('YYYY');
    const month = moment(uiState.now).format('MM');
    const daysInMonth = DateUtils.getDaysInMonth(year, month);
    const from = uiState.now + '-01';
    const till = uiState.now + '-' + daysInMonth;

    fetch(`http://${HOST}/bookingEntries/${uiState.profile.username}/${from}/${till}`, {
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
      .then((json) => dispatch(BookingEntriesSlice.setBookingEntries(json)))
      .catch((error) => {
        if (error.status === 401) {
          dispatch(UiStateSlice.setLoggedIn(false));
          dispatch(UiStateSlice.setActiveMenuItem(1)); // nicht eingeloggt
        }
        else
          dispatch(UiStateSlice.setCurrentError('Fehler! Der Server antwortet nicht.'));
      }
      );
  }, [dispatch, uiState.now])

  useEffect(() => fetchData(), [fetchData]);


  return (
    <main >
      <div className="position-relative overflow-hidden">
        <TabPanel index={0} activatedTab={uiState.activeMenuItem}>
          <Month fetchData={fetchData} />
        </TabPanel>
        <TabPanel index={1} activatedTab={uiState.activeMenuItem}>
          {uiState.loggedIn ? <Profile /> : <Login fetchData={fetchData} />}
        </TabPanel>
        <TabPanel index={2} activatedTab={uiState.activeMenuItem}>
          <Admin />
        </TabPanel>
      </div>
    </main>
  );
}

export default Main;
