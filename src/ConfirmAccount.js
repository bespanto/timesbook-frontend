import React, { useCallback, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MUILink from "@material-ui/core/Link";


/**
 * 
 */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}


/**
 * 
 */
function ConfirmAccount(props) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [accountConfirmed, setAccountConfirmed] = useState(false);

  const query = useQuery();
  const username = query.get("username");
  const regKey = query.get("regKey");


  /**
   * 
   */
  function showError(msg) {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  }


  /**
   * 
   */
  function showSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 5000);
  }


  /**
   * 
   */
  const confirmAdminAccount = useCallback(() => {
    if (!accountConfirmed) {
      const errorMsg = "Das Konto wurde nicht bestätigt.";
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
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showSuccess("Das Benutzerkonto wurde erfolgreich bestätigt");
            setAccountConfirmed(true);
          }
          else if (data.errorCode === 4022)
            showError(errorMsg + " Der Registrierungsschlüssel ist falsch.");
          else if (data.errorCode === 4023){
            showSuccess("Das Konto wurde bereits bestätigt.");
            setAccountConfirmed(true);
          }
          else if (data.errorCode === 4003)
            showError(errorMsg + " Der Benutzer wurde nicht eingeladen.");
          else {
            console.error(errorMsg + " Unerwarteter Fehler.", data)
            showError(errorMsg + " Unerwarteter Fehler.");
          }
        })
        .catch((err) => {
          console.error(errorMsg + " Fehler auf dem Server.", err);
          showError(errorMsg + " Fehler auf dem Server.");
        });
    }
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
          Bestätigung der Registrierung
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
