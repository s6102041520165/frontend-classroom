import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { storeToken, storeGoogleId } from "../reducers/actions";
import { useParams, Link, Route, Redirect } from "react-router-dom";
import FlatList from "flatlist-react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import AssignmentIcon from "@material-ui/icons/Assignment";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import BookIcon from "@material-ui/icons/Book";
import ListIcon from "@material-ui/icons/List";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import { makeStyles, Button, Grid } from "@material-ui/core";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import Querystring from "query-string"
import { json } from "body-parser";
import { render } from "react-dom";

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
    },
    card: {
        minWidth: 275,
        minHeight: 250,
        margin: "10px"
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)"
    },
    title: {
        fontSize: 14
    },
    pos: {
        marginBottom: 12
    },
    exampleWrapper: {
        position: "relative"
    },
    speedDial: {
        position: "fixed",
        "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
            bottom: theme.spacing(5),
            right: theme.spacing(2)
        },
        "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
            top: theme.spacing(2),
            left: theme.spacing(2)
        }
    },
    cardContent: {
        height: 200,
    },
}));

const Course = ({ message, Tokens, GoogleId, dispatch, match, location }) => {
    //let { scope } = useParams();
    const params = new URLSearchParams(location.search);
    //const code = params.get('code');
    const [code, setCode] = useState("");
    useEffect(async () => {
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        if (!code) {
            await authenticate()
        }
    }, []);

    async function authenticate() {


        await axios({
            'method': 'POST',
            'url': `https://www.googleapis.com/oauth2/v4/token`,
            'data': {
                "code": `${params.get('code')}`,
                "redirect_uri": "https://lineclassroom.herokuapp.com/redirect",
                "client_secret": "v-_5N09bLsRf3nsNYje1b4PR",
                "client_id": "308789454611-isrob12j0f3l23meqnl8959lvdfgdg67.apps.googleusercontent.com",
                "scope": "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.topics https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
                "grant_type": "authorization_code"
            }
        }).then(async (response) => {
            await console.log(response)
            dispatch(storeToken(response.data.access_token));
            await axios({
                'method': 'GET',
                'url': 'https://classroom.googleapis.com/v1/userProfiles/me',
                'headers': {
                    'Authorization': `Bearer ${response.data.access_token}`,
                    'Accept': 'application/json'
                }
            }).then((res) => {
                dispatch(storeGoogleId(response.data.id));
            })
        })

    }

};

const AppWithConnect = connect(googleMapState)(Course);
export default AppWithConnect;
