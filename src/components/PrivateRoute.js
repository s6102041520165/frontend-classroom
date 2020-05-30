import { connect } from "react-redux";
import React from "react";

import { Route, Redirect } from "react-router-dom";
import googleMapState from "../map-state/google-map-state";

//Check authorization
const App = ({ component: Component, message, Tokens, dispatch, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (Tokens != null) {
        return <Component {...props} />;
      } else {
        return <Redirect to="/login" />;
      }
    }}
  />
);


const AppWithConnect = connect(googleMapState)(App);
export default AppWithConnect;
