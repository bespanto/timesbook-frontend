import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import validate from "validate.js";
import { useLocation, Link } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function ResetPassword(props) {
  const query = useQuery();
  const [pass, setPass] = useState('');
  const [passRepeat, setPassRepeat] = useState('');
  const [regKey] = useState(query.get('regKey'));
  const [username] = useState(query.get('username'));
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoginLink, setShowLoginLink] = useState(false);
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UiStateSlice.setLoggedIn(false));
    localStorage.removeItem('jwt')
  }, [dispatch]);

  /**
 * Sets state for changed fields on tap event
 */
  function handleChange(event) {
    switch (event.target.name) {
      case "pass":
        setPass(event.target.value);
        break;
      case "passRepeat":
        setPassRepeat(event.target.value);
        break;
      default:
        break;
    }
  }

  function submitPass() {
    var constraints = {
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
    const result = validate({ pass: pass, passRepeat: passRepeat }, constraints);
    if (result !== undefined) {
      if (result.pass || result.passRepeat)
        dispatch(UiStateSlice.setCurrentError('Passwort muss mind. 6 Zeichen lang sein'));
    }
    else
      if (pass !== passRepeat)
        dispatch(UiStateSlice.setCurrentError('Passwörter stimmen nicht überein'));
      else {
        fetch(`${process.env.REACT_APP_API_URL}/auth/setpass`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username, password: pass, registrationKey: regKey }),
        })
          .then(function (response) {
            if (response.ok) {
              setSuccessMsg('Das Passwort wurde erfolgreich gesetzt');
              setShowLoginLink(true);
              setTimeout(() => setSuccessMsg(''), 5000);
            }
            else
              throw response
          })
          .catch((err) => {
            dispatch(UiStateSlice.setCurrentError('Das Setzen des Passwortes ist fehlgeschlagen.'));
          });
      }

    setTimeout(() => dispatch(UiStateSlice.setCurrentError('')), 5000);
  }

  return (
    <div>
      <div className="error">{uiState.currentError}</div>
      <div style={{ color: 'green' }}>{successMsg}</div>
      { showLoginLink ?
        <Link to="/Login">
          <p>Login</p>
        </Link>
        :
        <span>
          <p>Passwort für '{query.get('username')}' setzen</p>
          <div>Passwort</div>
          <div>
            <input
              name="pass"
              type="password"
              value={pass}
              onChange={handleChange}
            />
          </div>
          <div>Passwort wiederholen</div>
          <div>
            <input
              name="passRepeat"
              type="password"
              value={passRepeat}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: '0.3em', marginTop: '0.3em' }}>
            <button type="button" className="button" onClick={() => submitPass()}>Senden</button>
          </div>
        </span>}
    </div>
  );
}

export default ResetPassword;
