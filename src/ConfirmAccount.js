import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MUILink from "@material-ui/core/Link";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ConfirmAccount(props) {
  const query = useQuery();
  const [successMsg, setSuccessMsg] = useState("");
  const [accountConfirmed, setAccountConfirmed] = useState(false);
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!accountConfirmed)
      fetch(`${process.env.REACT_APP_API_URL}/auth/confirmation`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: query.get("username"),
          registrationKey: query.get("regKey"),
        }),
      })
        .then(function (response) {
          if (response.ok) {
            setSuccessMsg("Das Konto wurde erfolgreich bestätigt");
            setAccountConfirmed(true);
            setTimeout(() => setSuccessMsg(""), 5000);
          } else throw response;
        })
        .catch((err) => {
          err
            .json().then((data) => {
              if (data.errorCode === 4003)
                dispatch(UiStateSlice.setCurrentError("Falsche Bestätigungsanfrage."));
            })
            .catch((err) => {
              console.log(err);
              dispatch(UiStateSlice.setCurrentError("Fehler auf dem Server. Das Konto wurde nicht bestätigt."));
            });
        });
  }, [dispatch, query, accountConfirmed]);


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
          Kontobestätigung für '{query.get("username")}'
        </Typography>
      </Grid>
      <Grid item>
        <Typography style={{ color: "red", textAlign: "center" }}>
          {uiState.currentError}
        </Typography>
        <Typography style={{ color: "green", textAlign: "center" }}>
          {successMsg}
        </Typography>
      </Grid>
      {accountConfirmed &&
        <Grid item>
          <MUILink variant="body1" component={Link} to="/Login">
            Login
          </MUILink>
        </Grid>
      }
    </Grid>
  );
}

export default ConfirmAccount;
