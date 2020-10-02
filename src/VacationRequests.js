import React from "react";
import { useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";

function VacationRequests(props) {
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );

  return (
    <div>
      <div className="error">{uiState.currentError}</div>
      <p>Urlaubsanträge</p>
      <ul>
        <li className="text-left">Maria Dorsch</li>
        <li className="text-left">Jan Bartsch</li>
        <li className="text-left">Matthias Deller</li>
      </ul>
    </div>
  );
}

export default VacationRequests;
