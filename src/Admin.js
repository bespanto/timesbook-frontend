import React from "react";
import { useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";

function Admin(props) {
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );

  return (
    <div className="month">
      <div className="error">{uiState.currentError}</div>
      <p>Admin-Bereich</p>
      <ul>
        <li className="text-left">Unternehmen</li>
        <li className="text-left">Abteilungen</li>
        <li className="text-left">Projekte</li>
        <li className="text-left">Benutzer</li>
        <li className="text-left">Urlaubsanträge</li>
      </ul>
    </div>
  );
}

export default Admin;
