import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import validate from "validate.js";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";

function Login(props) {
  const [orga, setOrga] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [passRepeat, setPassRepeat] = useState('');
  const [registerMode, setRegisterMode] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const dispatch = useDispatch();
  let history = useHistory();

  /**
   * Handles login event
   */
  function handleLogin() {
    fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: pass }),
    })
      .then(function (response) {
        if (response.ok)
          return response.json();
        else
          throw response
      }).then(json => {
        localStorage.setItem('jwt', json.jwt)
        dispatch(UiStateSlice.setLoggedIn(true));
        history.push('/TimeBooking');
      })
      .catch((err) => {
        if (err.status === 400)
          dispatch(UiStateSlice.setCurrentError('Login ist gescheitert'));
        else
          dispatch(UiStateSlice.setCurrentError('Serveranfrage ist gescheitert'));
      });
    setTimeout(() => dispatch(UiStateSlice.setCurrentError('')), 5000);
  }

  /**
  * Handles register event
  */
  function handleRegister() {
    var constraints = {
      orga: {
        presence: true,
        length: {
          minimum: 1,
        },
      },
      name: {
        presence: true,
        length: {
          minimum: 1,
        },
      },
      username: {
        email: true
      },
      pass: {
        presence: true,
        length: {
          minimum: 6,
        },
      },
      passRepeat: {
        presence: true,
        length: {
          minimum: 1,
        },
      },
    };

    // Validate input fields
    const result = validate({ orga: orga, username: username, pass: pass, passRepeat: passRepeat, name: name }, constraints);
    if (result !== undefined) {
      if (result.orga)
        dispatch(UiStateSlice.setCurrentError('Organisation muss angegeben werden'));
      else
        if (result.name)
          dispatch(UiStateSlice.setCurrentError('Name muss angegeben werden'));
        else
          if (result.username)
            dispatch(UiStateSlice.setCurrentError('Benutzername muss eine gültige E-Mail sein'));
          else
            if (result.pass || result.passRepeat)
              dispatch(UiStateSlice.setCurrentError('Passwort muss mind. 6 Zeichen lang sein'));
    }
    else
      if (pass !== passRepeat)
        dispatch(UiStateSlice.setCurrentError('Passwörter stimmen nicht überein'));
      else {
        fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username, password: pass, name: name, organization: orga }),
        })
          .then(function (response) {
            if (response.ok) {
              resetRegisterFields();
              setSuccessMsg('Registrierung erfolgreich');
              setTimeout(() => setSuccessMsg(''), 5000);
              setRegisterMode(false);
            }
            else
              throw response
          })
          .catch((err) => {
            dispatch(UiStateSlice.setCurrentError('Registrierung ist nicht möglich.'));
          });
      }
    setTimeout(() => dispatch(UiStateSlice.setCurrentError('')), 5000);
  }

  /**
   * Reset all state fields
   */
  function resetRegisterFields() {
    setName('');
    setUsername('');
    setPass('');
    setPassRepeat('');
    setOrga('');
  }

  /**
   * Sets state for changed fields on tap event
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "username":
        setUsername(event.target.value);
        break;
      case "pass":
        setPass(event.target.value);
        break;
      case "orga":
        setOrga(event.target.value);
        break;
      case "name":
        setName(event.target.value);
        break;
      case "passRepeat":
        setPassRepeat(event.target.value);
        break;
      default:
        break;
    }
  }

  /**
   * Render output
   */
  return (
    <div className="month">
      <div className="error">{uiState.currentError}</div>
      <div style={{ color: 'green' }}>{successMsg}</div>
      { registerMode ?
        <p><ins>Registrieren</ins></p>
        :
        <p><ins>Login</ins></p>
      }
      <div>
        {registerMode && <span>
          <div>Organisation</div>
          <div>
            <input
              name="orga"
              type="text"
              value={orga}
              onChange={handleChange}
            />
          </div>
        </span>}
        {registerMode && <span>
          <div>Name</div>
          <div>
            <input
              name="name"
              type="text"
              value={name}
              onChange={handleChange}
            />
          </div>
        </span>}
        <div>Benutzername (E-Mail)</div>
        <div>
          <input
            name="username"
            type="email"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div>Passwort</div>
        <div>
          <input
            name="pass"
            type="password"
            value={pass}
            onChange={handleChange}
          />
        </div>
        {registerMode && <span>
          <div>Passwort wiederholen</div>
          <div>
            <input
              name="passRepeat"
              type="password"
              value={passRepeat}
              onChange={handleChange}
            />
          </div>
        </span>}
      </div>
      { registerMode ?
        <div style={{ marginBottom: '0.3em', marginTop: '0.3em' }}>
          <button type="button" className="button" onClick={() => handleRegister()}>Senden</button>
        </div>
        :
        <div style={{ marginBottom: '0.3em', marginTop: '0.3em' }}>
          <button type="button" className="button" onClick={() => handleLogin()}>Senden</button>
        </div>
      }
      {registerMode ?
        <div style={{ marginBottom: '0.3em', marginTop: '0.3em', cursor: 'pointer' }} onClick={() => setRegisterMode(false)}>
          <small><ins>Login</ins></small>
        </div>
        :
        <div style={{ marginBottom: '0.3em', marginTop: '0.3em', cursor: 'pointer' }} onClick={() => setRegisterMode(true)}>
          <small><ins>Registrieren</ins></small>
        </div>
      }
    </div>
  );
}

export default Login;
