import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import "./App.css";

function Header(props) {
  const dispatch = useDispatch();
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/user`, {
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
      .then((json) => {
        dispatch(UiStateSlice.setLoggedIn(true))
        dispatch(UiStateSlice.setProfile(json));
      })
      .catch((error) => {
        if (error.status === 401) {
          dispatch(UiStateSlice.setLoggedIn(false));
          dispatch(UiStateSlice.setActiveMenuItem('Login'));
        }
        else {
          dispatch(UiStateSlice.setCurrentError('Fehler! Der Server antwortet nicht.'));
        }
      }, []);
  })

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-dark bg-dark">
        <div className="dropdown">
          <button className="navbar-toggler" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {uiState.loggedIn &&
              uiState.profile.role === 'user' &&
              <div>
                <li className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem('TimeBooking'))}>Zeitbuchungen</li>
                <li className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem('Vacation'))}>Urlaub</li>
              </div>
            }
            <li className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem('Login'))}>
              {uiState.loggedIn ? 'Profil' : 'Login/Registrieung'}
            </li>

            {uiState.loggedIn &&
              uiState.profile.role === 'admin' &&
              <div>
                <hr />
                <li className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem('EmployeeManagement'))}>Mitarbeiter</li>
                <li className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem('VacationRequests'))}>Urlaubsanträge</li>
              </div>}

          </ul>
        </div>
        <div>
        </div>
        <div>
          <small>{uiState.loggedIn ? uiState.profile.name : ''}</small>
          <button className="button" onClick={() => dispatch(UiStateSlice.setActiveMenuItem('Login'))}>
            <FontAwesomeIcon icon={uiState.loggedIn ? faUser : faUserSlash} />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
