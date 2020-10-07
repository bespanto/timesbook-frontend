import React from "react";
import { useSelector } from "react-redux";
import * as UiStateSlice from "./redux/UiStateSlice";
import "./App.css";
//Material UI
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';

function Admin(props) {
  // const uiState = useSelector((state) =>
  //   UiStateSlice.selectUiState(state)
  // );

  return (
    <React.Fragment>
      <CssBaseline />
      <Box display="flex" justifyContent="center" style={{ marginBottom: '1em' }}>
        <Typography variant="h5">Urlaub</Typography>
      </Box>
      <ul>
        <li className="text-left">Antrag einreichen</li>
        <li className="text-left">Urlaubszeiten</li>
      </ul>
    </React.Fragment>
  );
}

export default Admin;
