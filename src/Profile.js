import React from "react";
import { useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";

function Profile(props) {
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );

  return (
    <div className="month">
      <div className="error">{uiState.currentError}</div>
      <p>Benutzerprofil</p>
      <ul>
  <li className="text-left">Name: {uiState.profile.name}</li>
        <li className="text-left">Organisation: {uiState.profile.organization}</li>
        <li className="text-left">Benutzername: {uiState.profile.username}</li>
        <li className="text-left">Role: {uiState.profile.role}</li>
      </ul>
    </div>
  );
}

export default Profile;
