import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import "./App.css";

function App() {

  return (
    <BrowserRouter>
      <div className="App app-width">
        <Header />
        <Main />
      </div>
    </BrowserRouter>
  );
}

export default App;
