import React from "react";
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from "@material-ui/core/IconButton";
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
  headerEmptySpace: {
    flexGrow: 1,
  },
  popupArea: {
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: 'auto',
    backgroundColor: 'rgba(0,0,0, 0.5)'
  },
  popupContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'fit-content',
    position: 'relative',
    top: '25%',
    margin: '0 1em',
    padding: '1em',
    color: 'white',
    border: '1px solid'
  }
}));

function Popup(props) {
  const { children } = props;
  const classes = useStyles();

  return (
    <Box className={classes.popupArea}>
      <Paper className={classes.popupContent}>
        <Box style={{display: 'flex'}}>
          <Box className={classes.headerEmptySpace}></Box>
          <Box style={{textAlign: 'right'}}>
            <IconButton variant="contained" size="small" onClick={(e) => props.handleClose()}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        {children}
      </Paper>
    </Box>
  );
}

export default Popup;
