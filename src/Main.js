import React from "react";
import { useSelector } from 'react-redux';
import TabPanel from "./TabPanel";
import Month from "./Month";
import "./App.css";
import * as UiStateSlice from "./redux/UiStateSlice";
import Login from "./Login";

function Main(props) {
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state))

  return (
    <main >
      <div className="position-relative overflow-hidden">
        <TabPanel index={0} activatedTab={uiState.activeMenuItem}>
          <Month />
        </TabPanel>
        <TabPanel index={1} activatedTab={uiState.activeMenuItem}>
          <Login />
        </TabPanel>
      </div>
    </main>
  );
}

export default Main;
