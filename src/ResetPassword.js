import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";

function ResetPassword(props) {
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const loc = useLocation();
  const dispatch = useDispatch();
  console.log(loc.pathname)

  useEffect(() => {
    dispatch(UiStateSlice.setLoggedIn(false));
    localStorage.removeItem('jwt')
  }, [dispatch]);

  return (
    <div>
      <div className="error">{uiState.currentError}</div>
      <p>Reset Password</p>
    </div>
  );
}

export default ResetPassword;
