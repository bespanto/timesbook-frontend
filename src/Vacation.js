import React from "react";
import "./App.css";
//Material UI
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function Admin(props) {

  return (
    <React.Fragment>
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
