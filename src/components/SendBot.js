import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { Button } from "@material-ui/core";
import Axios from "axios";

// Line Frontend Framework Init
const liff = window.liff;

//Initial state
const initialStateLine = {
  name: "",
  userLineId: "",
  statusMessage: "",
  pictureUrl: ""
};

const SendBot = ({ message, Tokens, GoogleId, dispatch }, props) => {
  const [{ name, userLineId, statusMessage, pictureUrl }, setStateLine] = useState(
    initialStateLine
  );
  useEffect(() => {
    console.log(props.line_id)
    if (props.line_id) {
      Axios.post('/user/updateUser', JSON.stringify({
        google_id: GoogleId,
        line_id: props.line_id,
      }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then((res) => {
        console.log(res)
      })
    }
    console.log(5555555555555555555)
  }, []);

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
        pictureUrl: getProfile.pictureUrl,
        statusMessage: getProfile.statusMessage
      });

    });
  };

  const closeLIFF = () => {
    liff.closeWindow();
  };

  return false;

}

const AppWithConnect = connect(googleMapState)(SendBot);
export default AppWithConnect;