import React, { useCallback, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MUILink from "@material-ui/core/Link";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ConfirmAccount(props) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [accountConfirmed, setAccountConfirmed] = useState(false);

  const query = useQuery();
  const username = query.get("username");
  const regKey = query.get("regKey");

  const confirmAdminAccount = useCallback(() => {
    if (!accountConfirmed)
      fetch(`${process.env.REACT_APP_API_URL}/auth/confirmAdminAccount`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          registrationKey: regKey,
        }),
      })
        .then(function (response) {
          if (response.ok) {
            setSuccess("Das Konto wurde erfolgreich bestätigt");
            setAccountConfirmed(true);
          } else throw response;
        })
        .catch((err) => {
          err
            .json().then((data) => {
              if (data.errorCode === 4003)
                setError("Falsche Bestätigungsanfrage");
            })
            .catch((err) => {
              console.log(err);
              setError("Fehler auf dem Server. Das Konto wurde nicht bestätigt");
            });
        });
    setTimeout(() => setError(""), 5000);
    setTimeout(() => setSuccess(""), 5000);
  }, [accountConfirmed, username, regKey])

  /**
   * 
   */
  useEffect(() => {
    confirmAdminAccount();
  }, [confirmAdminAccount]);


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
          {error}
        </Typography>
        <Typography style={{ color: "green", textAlign: "center" }}>
          {success}
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
