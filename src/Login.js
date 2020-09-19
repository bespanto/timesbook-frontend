import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import { HOST } from "./Const";
import "./App.css";

function Login(props) {
  const [username, setUsername] = useState('a');
  const [pass, setPass] = useState('');
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const dispatch = useDispatch();

  /**
 * 
 */
  function handleSubmit(e) {
    e.preventDefault();
    fetch(`http://${HOST}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: username, password: pass }),
    })
      .then(function (response) {
        if (response.status === 400)
          dispatch(UiStateSlice.setCurrentError('Login ist gescheitert'));
        else
          return response.json();
      }).then(json => {
        localStorage.setItem('jwt', json.jwt)
        props.fetchData();
        dispatch(UiStateSlice.setActiveMenuItem(0));
      })
      .catch((err) => {
        dispatch(UiStateSlice.setCurrentError('Serveranfrage ist gescheitert'));
      });
  }

  /**
 * 
 * @param {*} event 
 */
  function handleChange(event) {
    switch (event.target.name) {
      case "username":
        setUsername(event.target.value);
        break;
      case "pass":
        setPass(event.target.value);
        break;
      default:
        break;
    }
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
              name="username"
              type="text"
              onChange={handleChange}
            />
          </div>
          <div>Passwort</div>
          <div>
            <input
              name="pass"
              type="password"
              onChange={handleChange}
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
