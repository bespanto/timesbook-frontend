import React from "react";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FlightTakeoffRoundedIcon from '@material-ui/icons/FlightTakeoffRounded';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

function Home(props) {

  return (
    <Grid
      container
      spacing={1}
      // direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12} style={{ textAlign: 'center', paddingTop: '3em' }}>
        <AccessAlarmIcon style={{ fontSize: '60' }} />
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Typography variant="h6">
          Zeiterfassung
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Typography variant="caption">
          Arbeitszeit | Pause | Überstunden
        </Typography>
      </Grid>
      <Grid item xs={8} style={{ paddingTop: '1em', paddingBottom: '1em' }}>
        <Divider variant="middle" />
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center', paddingTop: '1em' }}>
        <FlightTakeoffRoundedIcon style={{ fontSize: '60' }} />
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Typography variant="h6">
          Urlaubsverwaltung
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Typography variant="caption">
          Antragstellung | Genehmigung | Stornierung
        </Typography>
      </Grid>
      <Grid item xs={8} style={{ paddingTop: '1em', paddingBottom: '1em' }}>
        <Divider variant="middle" />
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center', paddingTop: '1em' }}>
        <PeopleAltIcon style={{ fontSize: '60' }} />
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Typography variant="h6">
          Mitarbeiterverwaltung
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Typography variant="caption">
          Teilzeitmodelle | Gleitzeitanpassung | Jahresurlaub
        </Typography>
      </Grid>
      <Grid item xs={8} style={{ paddingTop: '1em', paddingBottom: '1em' }}>
        <Divider variant="middle" />
      </Grid>
    </Grid>
  );
}

export default Home;
