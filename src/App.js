//Import modules
import { Route } from "react-router-dom";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import HomeIcon from "@material-ui/icons/Home";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./views/GoogleAuth";

//Import screens
import CreateCourse from "./views/CreateCourse";
import UpdateCourse from "./views/UpdateCourse";
import Home from "./views/Home";
import PrivateRoute from "./views/PrivateRoute";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: "100%"
  },
  container: {
    maxWidth: 800,
    margin: "auto"
  }
});

//Main App
const App = ({ message, Tokens, dispatch }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Paper square className={classes.root}>
        <Tabs
          className={classes.container}
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon tabs example"
        >
          <Tab tab={<Link to="/" />} icon={<HomeIcon />} aria-label="Home" />
          <Tab
            tab={<Link to="/create-course" />}
            icon={<FavoriteIcon />}
            aria-label="favorite"
          />
          <Tab icon={<PersonPinIcon />} aria-label="person" />
        </Tabs>
      </Paper>

      <div
        style={{
          margin: "auto",
          maxWidth: "800px",
          textAlign: "center"
        }}
      >
        <Route exact path="/" component={Home} />
        <PrivateRoute path="/create-course" component={CreateCourse} />
        <PrivateRoute path="/update-course" component={UpdateCourse} />
        <Route path="/login" component={Login} />
      </div>
    </div>
  );
};

const mapStateToProps = function(state) {
  return {
    message: "This is message from mapStateToProps",
    Tokens: state.tokens || null
  };
};

const AppWithConnect = connect(mapStateToProps)(App);
export default AppWithConnect;
