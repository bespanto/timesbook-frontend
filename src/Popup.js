import React from "react";
import "./App.css";

function Popup(props) {
  const { children } = props;
  return (
    <div className="popup">
      <div className="popup-content">
        <div className="menu">
          <div className="menu-left"></div>
          <div className="menu-right">
            <input
              type="button"
              value="x"
              className="button"
              onClick={(e) => props.handleClose()}
            ></input>
          </div>
        </div>
        {children}
        <div></div>
      </div>
    </div>
  );
}

export default Popup;
