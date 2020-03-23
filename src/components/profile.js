import React, { Component, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import FlatList from "flatlist-react";
import Select from "react-select";
import {
  FormControl,
  InputLabel,
  MenuItem,
  makeStyles,
  ListItem,
  List,
  ListItemText,
  Divider
} from "@material-ui/core";

// Line Frontend Framework Init
const liff = window.liff;

//Initial state
const initialStateLine = {
  name: "",
  userLineId: "",
  statusMessage: ""
};

const initialState = {
  courseId: "",
  userId: "",
  role: ""
};

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

const renderPerson = (course, idx) => {
  console.log(idx);
  return (
    <MenuItem key={course.id} value={course.id}>
      {course.name}
    </MenuItem>
  );
};

const Invitation = ({ message, Tokens, GoogleId, dispatch }) => {
  const [courses, setCourses] = useState("");
  const [{ name, userLineId, statusMessage }, setStateLine] = useState(
    initialStateLine
  );
  useEffect(() => {
    
    if (!name) {
      getProfile();
    }
  }, []);

  const clearState = () => {
    setStateLine({ ...initialStateLine });
  };

  const classes = useStyles();

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
      setStateLine({
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
    <div id="create-course">
      {
        (name && name != '')
          ?
          <p>Name: {name}</p>
          :
          null
      }
    </div>
  );
};

const AppWithConnect = connect(googleMapState)(Invitation);
export default AppWithConnect;
