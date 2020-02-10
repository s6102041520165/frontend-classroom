import { storeToken, storeGoogleId } from "../reducers/actions";
import React from "react";
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";
import { Redirect, Route, Link, Router } from "react-router-dom";
import { Button } from "@material-ui/core";
import googleMapState from "../map-state/google-map-state";
import { render } from "@testing-library/react";
//import { Route, Redirect } from "react-router-dom";

//Callback uri function
const onFailLogin = res => {
  console.log(res);
};

const App = ({
  component: Component,
  message,
  Tokens,
  GoogleId,
  dispatch,
  ...rest
}) => (
  <GoogleLogin
    clientId="308789454611-isrob12j0f3l23meqnl8959lvdfgdg67.apps.googleusercontent.com"
    buttonText="Login with Google"
    onSuccess={res => {
      //console.log(Tokens);
      //Save response to reducer state
      dispatch(storeToken(res.accessToken));
      dispatch(storeGoogleId(res.googleId));
      return <Redirect go={-2}/>;
    }}
    onFailure={onFailLogin}
    cookiePolicy={"single_host_origin"}
    scope="https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me"
    redirectUri="https://lineclassroom.herokuapp.com/redirect"
    uxMode="popup"
    style={{ position: "absolute", marginTop: "50%" }}
  />
);



const AppWithConnect = connect(googleMapState)(App);
export default AppWithConnect;
