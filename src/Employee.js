import React from "react";
import { useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import shortid from "shortid";
import "./App.css";

function Admin(props) {
  const uiState = useSelector((state) =>
    UiStateSlice.selectUiState(state)
  );


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
      <p>Mitarbeiter</p>
      <div>
        <div>
          Name
        </div>
        <div>
          <small><input size="15" type="text" name="name" /></small>
        </div>
        <div>
          E-Mail
        </div>
        <div>
          <small><input size="15" type="text" name="username" /></small>
        </div>
        <div>
          <button className="button">Einladen</button>
        </div>
      </div>
      <div className="row section" style={{ marginTop: '1em' }}>
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
