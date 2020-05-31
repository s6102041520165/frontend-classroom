import React, { Component, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import SendBot from "./SendBot";
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
  statusMessage: "",
  pictureUrl: ""
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
  const [{ name, userLineId, statusMessage,pictureUrl }, setStateLine] = useState(
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
    liff.init({liffId: '1603224534-qKKA3AoL'},async () => {
      let getProfile = await liff.getProfile();
      setStateLine({
        name: getProfile.displayName,
        userLineId: getProfile.userId,
        pictureUrl: getProfile.pictureUrl,
        statusMessage: getProfile.statusMessage
      });

      await axios.post('/user/updateUser', JSON.stringify({
        line_id: getProfile.userId,
        google_id: GoogleId,
        f_name: 'Test',
        l_name: 'Ha Ha!'
      }),
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          }
      ).then((res) => {
          console.log(res)
      })
    });
  };

  const closeLIFF = () => {
    liff.closeWindow();
  };

  return (
    <div id="create-course">
      {(userLineId)? <SendBot userId={userLineId}/>: ""}
      {
        (pictureUrl && pictureUrl != '')
          ?
          <p><img src={pictureUrl} style={{maxWidth:'300px',height:'auto',borderRadius:'20px'}}/></p>
          :
          null
      }
      {
        (name && name != '')
          ?
          <h3>Name: {name}</h3>
          :
          <h3>Browser not support.</h3>
      }
    </div>
  );
};

const AppWithConnect = connect(googleMapState)(Invitation);
export default AppWithConnect;
