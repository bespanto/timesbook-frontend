import React from "react";
import moment from "moment";
import "./App.css";
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import BlockRoundedIcon from '@material-ui/icons/BlockRounded';


function WorkingModelCard(props) {
    const classes = useStyles();

    return (
        <Paper style={{ paddingBottom: '0.5em' }}>
            <Grid container alignItems="center" style={{ marginTop: '0.5em' }}>
                <Grid item xs={10} style={{ textAlign: 'center', paddingBottom: '0.5em', paddingTop: '0.5em' }}>
                    <Typography>Gültig ab {moment(props.workingModel.validFrom).format('DD.MM.YYYY')}</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'center' }} >
                    {props.removable ?
                     <IconButton size="small" onClick={() => props.deleteWorkingModel(props.workingModel._id)}>
                        <DeleteIcon />
                    </IconButton>
                    : <BlockRoundedIcon />
                }
                </Grid>
                <Grid container>
                    <Grid item xs={2} style={{ textAlign: 'center' }}>
                        <Typography variant="caption">Mo.</Typography>
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: 'center' }}>
                        <Typography variant="caption">Di.</Typography>
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: 'center' }}>
                        <Typography variant="caption">Mi.</Typography>
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: 'center' }}>
                        <Typography variant="caption">Do.</Typography>
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: 'center' }}>
                        <Typography variant="caption">Fr.</Typography>
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: 'center' }}>
                        <Typography variant="caption">Sa.</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="body2">{props.workingModel['1']}</Typography></Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="body2">{props.workingModel['2']}</Typography></Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="body2">{props.workingModel['3']}</Typography></Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="body2">{props.workingModel['4']}</Typography></Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="body2">{props.workingModel['5']}</Typography></Grid>
                <Grid item xs={2} className={classes.bookingRow}>
                    <Typography variant="body2">{props.workingModel['6']}</Typography></Grid>
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
