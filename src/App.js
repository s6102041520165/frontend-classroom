//Import modules
import { Route } from "react-router-dom";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import HomeIcon from "@material-ui/icons/Home";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./components/GoogleAuth";

//Import screens
import CreateCourse from "./components/CreateCourse";
import UpdateCourse from "./components/UpdateCourse";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
import googleMapState from "./map-state/google-map-state";
import { Button } from "@material-ui/core";

const liff = window.liff;

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

const initialState = {
  name: "",
  userLineId: "",
  statusMessage: ""
};

//Main App
const App = ({ message, Tokens, dispatch, props }) => {
  const [{ name, userLineId, statusMessage }, setState] = useState(
    initialState
  );
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    console.log(liff);
    setValue(newValue);
  };

  const sendMessage = () => {
    liff
      .sendMessage([
        {
          type: "text",
          text: `Say Hi!`
        }
      ])
      .then(() => {
        liff.closeWindow();
      });
  };

  const getProfile = () => {
    liff.init(async () => {
      let getProfile = await liff.getProfile();
      setState({
        name: getProfile.displayName,
        userLineId: getProfile.userId,
        statusMessage: getProfile.statusMessage
      });
    });
  };

  const closeLIFF = () => {
    liff.closeWindow();
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
        <p>{name}</p>
        <p>{userLineId}</p>
        <Button onClick={getProfile}>Get Profile</Button>
        <Route exact path="/" component={Home} />
        <PrivateRoute path="/create-course" component={CreateCourse} />
        <PrivateRoute path="/update-course" component={UpdateCourse} />
        <Route path="/login" component={Login} />
      </div>
    </div>
  );
};

const AppWithConnect = connect(googleMapState)(App);
export default AppWithConnect;
