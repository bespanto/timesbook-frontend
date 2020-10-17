import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import validate from "validate.js";
import { useLocation, Link } from "react-router-dom";
import * as UiStateSlice from "./redux/UiStateSlice";
// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MUILink from "@material-ui/core/Link";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ResetPassword(props) {
  const query = useQuery();
  const [pass, setPass] = useState("");
  const [passRepeat, setPassRepeat] = useState("");
  const [regKey] = useState(query.get("regKey"));
  const [username] = useState(query.get("username"));
  const [successMsg, setSuccessMsg] = useState("");
  const [showLoginLink, setShowLoginLink] = useState(false);
  const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("jwt");
  }, [dispatch]);

  /**
   * Sets state for changed fields on tap event
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "pass":
        setPass(event.target.value);
        break;
      case "passRepeat":
        setPassRepeat(event.target.value);
        break;
      default:
        break;
    }
  }

  function submitPass() {
    var constraints = {
      pass: {
        presence: true,
        length: {
          minimum: 6,
        },
      },
      passRepeat: {
        presence: true,
        length: {
          minimum: 1,
        },
      },
    };

    // Validate input fields
    const result = validate(
      { pass: pass, passRepeat: passRepeat },
      constraints
    );
    if (result !== undefined) {
      if (result.pass || result.passRepeat)
        dispatch(
          UiStateSlice.setCurrentError(
            "Passwort muss mind. 6 Zeichen lang sein"
          )
        );
    } else if (pass !== passRepeat)
      dispatch(
        UiStateSlice.setCurrentError("Passwörter stimmen nicht überein")
      );
    else {
      fetch(`${process.env.REACT_APP_API_URL}/auth/setpass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: pass,
          registrationKey: regKey,
        }),
      })
        .then(function (response) {
          if (response.ok) {
            setSuccessMsg("Das Passwort wurde erfolgreich gesetzt");
            setShowLoginLink(true);
            setTimeout(() => setSuccessMsg(""), 5000);
          } else throw response;
        })
        .catch((err) => {
          err
            .json()
            .then((data) => {
              if (data.errorCode === 4005)
                dispatch(
                  UiStateSlice.setCurrentError(
                    "Das Passwort ist bereits gesetzt."
                  )
                );
              else if (data.errorCode === 4006)
                dispatch(
                  UiStateSlice.setCurrentError(
                    "Das Setzen des Passwortes ist nicht möglich. Falscher Registrierungsschlüssel."
                  )
                );
            })
            .catch((err) => {
              console.log(err);
              dispatch(
                UiStateSlice.setCurrentError(
                  "Das Setzen des Passwortes ist fehlgeschlagen."
                )
              );
            });
        });
    }
    setTimeout(() => dispatch(UiStateSlice.setCurrentError("")), 5000);
  }

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h5">
          Passwort für '{query.get("username")}' setzen
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
      {showLoginLink ? (
        <Grid item>
          <MUILink variant="body1" component={Link} to="/Login">
            Login
          </MUILink>
        </Grid>
      ) : (
        <Grid item>
          <Grid
            container
            spacing={1}
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <TextField
                id="pass"
                type="password"
                label="Passwort"
                variant="outlined"
                name="pass"
                value={pass}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                id="passRepeat"
                type="password"
                label="Passwort wiederholen"
                variant="outlined"
                name="passRepeat"
                value={passRepeat}
                onChange={handleChange}
              />
            </Grid>
            <Grid item style={{ marginBottom: "0.3em", marginTop: "0.3em" }}>
              <Button variant="contained" onClick={() => submitPass()}>
                Senden
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ResetPassword;
