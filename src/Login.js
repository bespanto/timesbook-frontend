import React from "react";
import { useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";

function Login(props) {
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );

  /**
 * 
 */
  function handleSubmit(e) {
    e.preventDefault();
    console.log('handle submit');
  }

  return (
    <div className="month">
      <div className="error">{uiState.currentError}</div>
      <p>Login</p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <div>Benutzername</div>
          <div>
            <input
              name="user"
              type="text"
            />
          </div>
          <div>Passwort</div>
          <div>
            <input
              name="password"
              type="password"
            />
          </div>
        </div>
        <div style={{ marginBottom: '0.3em', marginTop: '0.3em' }}>
          <input
            type="submit"
            value="Senden"
            className="button"
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
