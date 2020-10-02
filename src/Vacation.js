import React from "react";
import { useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";

function Admin(props) {
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );

  return (
    <div>
      <div className="error">{uiState.currentError}</div>
      <p>Urlaub</p>
      <ul>
        <li className="text-left">Antrag einreichen</li>
        <li className="text-left">Urlaubszeiten</li>
      </ul>
    </div>
  );
}

export default Admin;
