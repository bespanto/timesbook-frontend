import React from "react";
import moment from "moment";
import * as Utils from "./Utils";
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';

function FlextimeCorrectionCard(props) {
    const classes = useStyles();

    return (
        <Paper style={{ paddingBottom: '0.5em', marginTop: '0.5em' }}>
            <Grid container alignItems="center">
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center" >
                        <Box flexGrow={1} style={{ textAlign: 'center', paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                            <Typography variant="body2">{Utils.minutesToTimeString(props.value)} Std.</Typography>
                        </Box>
                        {props.deleteFlextime &&
                            <Box>
                                <IconButton size="small" onClick={() => props.deleteFlextime(props.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>}
                    </Box>
                </Grid>
                <Grid item xs={2} className={classes.bookingRow} style={{ paddingLeft: '0.5em' }}>
                    <Typography variant="caption">Datum:</Typography>
                </Grid>
                <Grid item xs={10} className={classes.bookingRow}>
                    <Typography variant="caption">{moment(props.date).format('DD.MM.YYYY')}</Typography>
                </Grid>

                <Grid item xs={2} className={classes.bookingRow} style={{ paddingLeft: '0.5em' }}>
                    <Typography variant="caption">Grund:</Typography>
                </Grid>
                <Grid item xs={10} className={classes.bookingRow}>
                    <Typography variant="caption">{props.reason}</Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}

const useStyles = makeStyles((theme) => ({
    bookingRow: {
        // borderRight: '1px solid',
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
}));

export default FlextimeCorrectionCard;
