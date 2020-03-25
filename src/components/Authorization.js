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
  <Route
    {...rest}
    render={props => {
    
      if (Tokens == null) {
        return <Component {...props} />;
      } else {
        return <Redirect to="/" />;
      }
    }}
  />
  /**/
);



const AppWithConnect = connect(googleMapState)(App);
export default AppWithConnect;
