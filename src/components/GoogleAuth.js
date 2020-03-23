import { storeToken, storeGoogleId } from "../reducers/actions";
import React from "react";
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";
import { Redirect, Route, Link, Router } from "react-router-dom";
import { Button } from "@material-ui/core";
import googleMapState from "../map-state/google-map-state";
import { render } from "@testing-library/react";
//import { Route, Redirect } from "react-router-dom";
import qs from "query-string";

//Callback uri function
const onFailLogin = res => {
  console.log(res);
};

const togglePage = e => {
  
}

const App = ({
  component: Component,
  message,
  Tokens,
  GoogleId,
  dispatch,
  ...rest
}) => (

    <Button
      //to={`https://lineappbackend.herokuapp.com/webhook/auth/google`}
      //*component={Link}
      variant="contained"
      color="primary"
      style={{ margin: 'auto' }}
      href="https://lineappbackend.herokuapp.com/webhook/auth/google">
      SignIn With Google
    </Button>
  );



const AppWithConnect = connect(googleMapState)(App);
export default AppWithConnect;
