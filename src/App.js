import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {

  return (
    <BrowserRouter>
      <React.Fragment>
        <CssBaseline />
        <div>
          <Header />
          <Main />
        </div>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
