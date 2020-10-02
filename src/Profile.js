import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";


function Profile(props) {
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const dispatch = useDispatch();

  function logout(){
    console.log('logout');
    localStorage.removeItem('jwt');
    dispatch(UiStateSlice.setLoggedIn(false));
    dispatch(UiStateSlice.setActiveMenuItem('Login'));
  }

  return (
    <div className="month">
      <div className="error">{uiState.currentError}</div>
      <p>Benutzerprofil</p>
      <div className="row">
        <div className="col text-right"><ins>Name</ins>:</div>
        <div className="col  text-left">{uiState.profile.name}</div>
      </div>
      <div className="row">
        <div className="col text-right"><ins>Organisation</ins>:</div>
        <div className="col text-left">{uiState.profile.organization}</div>
      </div>
      <div className="row">
        <div className="col text-right"><ins>Benutzername</ins>:</div>
        <div className="col text-left">{uiState.profile.username}</div>
      </div>
      <div className="row">
        <div className="col text-right"><ins>Role</ins>:</div>
        <div className="col text-left">{uiState.profile.role}</div>
      </div>
      <div className="row">
        <div className="col">
          <button type="button" className="button" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
