import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import "./App.css";

function Popup(props) {
  const { children } = props;
  return (
    <div className="popup">
      <div className="popup-content">
        <div className="menu">
          <div className="menu-left"></div>
          <div className="menu-right">
            <button className="button" onClick={(e) => props.handleClose()}>
              <FontAwesomeIcon icon={faWindowClose} />
            </button>
          </div>
        </div>
        {children}
        <div></div>
      </div>
    </div>
  );
}

export default Popup;
