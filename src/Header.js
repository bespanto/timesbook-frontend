import React from 'react';
import { useDispatch } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";

function Header(props) {
  const dispatch = useDispatch();

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-dark bg-dark">
        <div className="dropdown">
          <button className="navbar-toggler" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <span className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem(0))}>Calendar</span>
            <span className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem(1))}>Panel 2</span>
            <span className="dropdown-item" onClick={() => dispatch(UiStateSlice.setActiveMenuItem(2))}>Panel 3</span>
          </div>
        </div>
        <div>
        </div>
        <div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
