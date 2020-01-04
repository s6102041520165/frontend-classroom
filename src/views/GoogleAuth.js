import { storeToken } from "../reducers/actions";
import React from "react";
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
//import { Route, Redirect } from "react-router-dom";

//Callback uri function
const onFailLogin = res => {
  console.log(res);
};

const App = ({ component: Component, message, Tokens, dispatch, ...rest }) => (
  <GoogleLogin
    clientId="308789454611-isrob12j0f3l23meqnl8959lvdfgdg67.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={res => {
      //console.log(Tokens);
      //Save response to reducer state
      dispatch(storeToken(res.accessToken));
    }}
    onFailure={onFailLogin}
    cookiePolicy={"single_host_origin"}
    scope="https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.courses.readonly"
    redirectUri="http://localhost:3000/create-course"
    style={{ position: "absolute", marginTop: "50%" }}
  />
);

const mapStateToProps = function(state) {
  return {
    message: "This is message from mapStateToProps",
    Tokens: state.tokens || null
  };
};

const AppWithConnect = connect(mapStateToProps)(App);
export default AppWithConnect;
