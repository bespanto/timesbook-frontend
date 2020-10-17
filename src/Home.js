import React from "react";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

function Home(props) {

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h6">
          Home
        </Typography>
      </Grid>
      <Grid item>
        Content
        </Grid>
    </Grid>
  );
}

export default Home;
