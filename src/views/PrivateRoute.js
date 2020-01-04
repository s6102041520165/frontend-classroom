import { connect } from "react-redux";
import React from "react";

import { Route, Redirect } from "react-router-dom";

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

const mapStateToProps = function(state) {
  return {
    message: "This is message from mapStateToProps",
    Tokens: state.tokens || null
  };
};

const AppWithConnect = connect(mapStateToProps)(App);
export default AppWithConnect;
