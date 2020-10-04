import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import "./App.css";

function Header(props) {
  const dispatch = useDispatch();
  let history = useHistory();
  const loc = useLocation();
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );

  useEffect(() => {
    if (loc.pathname !== '/resetPassword') {
      if (!uiState.loggedIn) {
        history.push('/Login');
      }
      else {
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
            dispatch(UiStateSlice.setProfile(json));
            dispatch(UiStateSlice.setLoggedIn(true));
          })
          .catch((error) => {
            if (error.status === 401) {
              dispatch(UiStateSlice.setLoggedIn(false));
            }
            else {
              dispatch(UiStateSlice.setCurrentError('Fehler! Der Server antwortet nicht.'));
            }
          });
      }
    }
  }, [history, dispatch, uiState.loggedIn, loc.pathname])

  return (
    <header className="sticky-top">
      {   uiState.loggedIn ? <nav className="navbar navbar-dark bg-dark">
        <div className="dropdown">
          <button className="navbar-toggler" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {uiState.loggedIn &&
              <div>
                <Link to="/TimeBooking"><li className="dropdown-item">Zeitbuchungen</li></Link>
                <Link to="/Vacation"><li className="dropdown-item">Urlaub</li></Link>
              </div>
            }
            <Link to="/Login">
              <li className="dropdown-item">
                {uiState.loggedIn ? 'Profil' : 'Login/Registrieung'}
              </li>
            </Link>
            {uiState.loggedIn &&
              uiState.profile.role === 'admin' &&
              <div>
                <hr />
                <Link to="/Employees"><li className="dropdown-item">Mitarbeiter</li></Link>
                <Link to="/VacationRequests"><li className="dropdown-item">Urlaubsanträge</li></Link>
              </div>}

          </ul>
        </div>
        <div>
        </div>
        <div>
          <small>{uiState.loggedIn ? uiState.profile.name : ''}</small>
          <Link to="/Login">
            <button className="button">
              <FontAwesomeIcon icon={uiState.loggedIn ? faUser : faUserSlash} />
            </button>
          </Link>
        </div>
      </nav>
        :
        <h2>TimesBook</h2>
      }
    </header>
  );
}

export default Header;
