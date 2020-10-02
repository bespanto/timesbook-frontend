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
      <p>Mitarbeiter</p>
      <ul>
        <li className="text-left">Maria Dorsch</li>
        <li className="text-left">Jan Bartsch</li>
        <li className="text-left">Matthias Deller</li>
      </ul>
    </div>
  );
}

export default Admin;
