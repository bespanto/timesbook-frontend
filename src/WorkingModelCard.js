import React from "react";
import moment from "moment";
import "./App.css";
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import LockRoundedIcon from '@material-ui/icons/LockRounded';


function WorkingModelCard(props) {
    const classes = useStyles();

    return (
        <Paper style={{ paddingBottom: '0.5em' }}>
            <Grid container alignItems="center" style={{ marginTop: '0.5em' }}>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center" >
                        <Box flexGrow={1} style={{ textAlign: 'center', paddingTop: '0.5em', paddingBottom: '0.5em' }} >
                            <Typography variant="body2">Gültig ab {moment(props.workingModel.validFrom).format('DD.MM.YYYY')}</Typography>
                        </Box>
                        <Box>
                            {props.removable &&
                                <IconButton size="small" onClick={() => props.deleteWorkingModel(props.workingModel._id)}>
                                    <DeleteIcon />
                                </IconButton>}
                            {props.locked && <LockRoundedIcon />}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">Mo.</Typography>
                </Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">Di.</Typography>
                </Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">Mi.</Typography>
                </Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">Do.</Typography>
                </Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">Fr.</Typography>
                </Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">Sa.</Typography>
                </Grid>

                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">{props.workingModel['1']}</Typography></Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">{props.workingModel['2']}</Typography></Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">{props.workingModel['3']}</Typography></Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">{props.workingModel['4']}</Typography></Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">{props.workingModel['5']}</Typography></Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="caption">{props.workingModel['6']}</Typography></Grid>

                    <Grid item xs={12} className={classes.bookingRow}>
                    <Typography variant="caption">Jahresurlaubsanspruch: {props.workingModel.vacationEntitlement} Tage</Typography></Grid>
            </Grid>
        </Paper>
    );
}

const useStyles = makeStyles((theme) => ({
    bookingRow: {
        // borderRight: '1px solid',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default WorkingModelCard;
