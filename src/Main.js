import React from "react";
import { Switch, Route} from "react-router-dom";
import Month from "./Month";
import Login from "./Login";
import Register from "./Register";
import RecoverPass from "./RecoverPass";
import Profile from "./Profile";
import Employee from "./Employee";
import VacationRequests from "./VacationRequests";
import Vacation from "./Vacation";
import Overview from "./Overview";
import SickDays from "./SickDays";
import ResetPassword from "./ResetPassword";
import ConfirmAccount from "./ConfirmAccount";
import Home from "./Home";

function Main(props) {

  return (
    <main>
      <Switch>
        <Route path="/Home">
          <Home />
        </Route>
        <Route path="/TimeBooking">
          <Month />
        </Route>
        <Route path="/Login">
          <Login />
        </Route>
        <Route path="/Register">
          <Register />
        </Route>
        <Route path="/RecoverPass">
          <RecoverPass />
        </Route>
        <Route path="/Profile">
          <Profile />
        </Route>
        <Route path="/Employees">
          <Employee />
        </Route>
        <Route path="/Vacation">
          <Vacation />
        </Route>
        <Route path="/Overview">
          <Overview />
        </Route>
        <Route path="/VacationRequests">
          <VacationRequests />
        </Route>
        <Route path="/SickDays">
          <SickDays />
        </Route>
        <Route path="/ResetPassword">
          <ResetPassword />
        </Route>
        <Route path="/ConfirmAccount">
          <ConfirmAccount />
        </Route>
      </Switch>
    </main>
  );
}

export default Main;
