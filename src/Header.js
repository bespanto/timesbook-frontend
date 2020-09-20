import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { HOST } from "./Const";
import "./App.css";

function Header(props) {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );

  useEffect(() => {
    fetch(`http://${HOST}/api/user/profile`, {
      headers: {
        'auth-token': localStorage.getItem('jwt')
      }
    })
      .then((response) => {
        if (response.ok)
          return response.json();
        else
          throw response
      })
      .then((json) => {console.log(json); setName(json.name); dispatch(UiStateSlice.setLoggedIn(true))})
      .catch((error) => {
        if (error.status === 401){
          dispatch(UiStateSlice.setLoggedIn(false));// nicht eingeloggt
          setName('');
        }
        else
          dispatch(UiStateSlice.setCurrentError('Fehler! Der Server antwortet nicht.'));
      });
  })

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-dark bg-dark">
        <div className="dropdown">
          <button className="navbar-toggler" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <span className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem(0))}>Zeitbuchungen</span>
            <span className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem(1))}>Login</span>
          </div>
        </div>
        <div>
        </div>
        <div>
        <small>{name}</small>
          <button className="button" onClick={() => dispatch(UiStateSlice.setActiveMenuItem(1))}>
            <FontAwesomeIcon icon={uiState.loggedIn ? faUser : faUserSlash} />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
