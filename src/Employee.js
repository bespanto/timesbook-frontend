import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { patchData } from "./serverConnections/connect";
import validate from "validate.js";
import * as UiStateSlice from "./redux/UiStateSlice";
import shortid from "shortid";
import "./App.css";

function Admin(props) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );
  const dispatch = useDispatch();

  /**
 * Sets state for changed fields on tap event
 */
  function handleChange(event) {
    switch (event.target.name) {
      case "username":
        setUsername(event.target.value);
        break;
      case "name":
        setName(event.target.value);
        break;
      default:
        break;
    }
  }

  function inviteUser() {

    var constraints = {
      name: {
        presence: true,
        length: {
          minimum: 1,
        },
      },
      username: {
        email: true
      },
    };

    const userInfo = {
      username: username,
      name: name,
      organization: uiState.profile.organization
    }
    // Validate input fields
    const result = validate(userInfo, constraints);
    if (result !== undefined) {
      if (result.name)
        dispatch(UiStateSlice.setCurrentError('Name muss angegeben werden'));
      else
        if (result.username)
          dispatch(UiStateSlice.setCurrentError('Benutzername muss eine gültige E-Mail sein'));
    } else {
      patchData(`${process.env.REACT_APP_API_URL}/user/invite`,
        localStorage.getItem('jwt'),
        userInfo
      )
        .then((response) => {
          if (response.ok)
            return response.json();
          else
            throw response
        })
        .then((json) => {
          dispatch(UiStateSlice.setCurrentError(''));
          setSuccessMsg(`Der Benutzer ${username} wurde erfolgreich eingeladen`);
          setName('');
          setUsername('');
          setTimeout(()=>setSuccessMsg(''), 5000);
        })
        .catch((error) => {
          if (error.status === 403) {
            dispatch(UiStateSlice.setCurrentError('Sie sind nicht berechtigt Benutzer einzuladen.'));
          }
          if (error.status === 500) {
            dispatch(UiStateSlice.setCurrentError('Einladen ist fehlgeschlagen. Fehler beim senden der Nachricht.'));
          }
          else {
            console.log(error);
            dispatch(UiStateSlice.setCurrentError('Fehler! Der Server antwortet nicht.'));
          }
        }
        );
    }
    setTimeout(()=>dispatch(UiStateSlice.setCurrentError('')), 5000);
  }

  function getEmployees() {
    const empArr = [
      {
        name: 'Maria Dorsch',
        username: 'm.dorsch@gmail.com',
        status: 'activ'
      },
      {
        name: 'Jan Bartsch',
        username: 'j.bartsch@yahoo.com',
        status: 'activ'
      },
    ]
    let arr = [];
    empArr.forEach(item => {
      arr.push(
        <div key={shortid.generate()} className="row section">
          <div className="col">
            <small>{item.name}</small>
          </div>
          <div className="col">
            <small>{item.username}</small>
          </div>
          <div className="col">
            <small>{item.status}</small>
          </div>
        </div>)
    })
    return arr;
  }

  return (
    <div>
      <div className="error">{uiState.currentError}</div>
      <div style={{ color: 'green' }}>{successMsg}</div>
      <p>Mitarbeiter</p>
      <div>
        <div>
          Name
        </div>
        <div>
          <small>
            <input size="20"
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
            /></small>
        </div>
        <div>
          E-Mail
        </div>
        <div>
          <small>
            <input size="20"
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
            /></small>
        </div>
        <div style={{marginTop: '0.5em'}}>
          <button className="button" onClick={() => inviteUser()}>Einladen</button>
        </div>
      </div>
      <div className="row section" style={{ marginTop: '1.5em' }}>
        <div className="col">
          Name
        </div>
        <div className="col">
          E-Mail
        </div>
        <div className="col">
          Status
        </div>
      </div>
      {getEmployees()}
    </div>
  );
}

export default Admin;
