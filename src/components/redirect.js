import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { storeToken, storeGoogleId, storePermissions } from "../reducers/actions";
import { makeStyles, Button, Grid } from "@material-ui/core";


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

const Course = ({ component: Component, message, Tokens, Permissions, GoogleId, dispatch, match, location }) => {
    //let { scope } = useParams();
    const params = new URLSearchParams(location.search);
    const [{ name, userLineId, statusMessage, pictureUrl }, setStateLine] = useState(
        initialStateLine
    );
    //const code = params.get('code');
    const [code, setCode] = useState("");
    useEffect(() => {
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual

        if (!code) {
            authenticate()
        }
    }, []);

    const getProfile = async (data) => {
        await liff.init({ liffId: '1603224534-VGPrnrMm' }, async () => {
            const getProfile = await liff.getProfile();
            setStateLine({
                name: getProfile.displayName,
                userLineId: getProfile.userId,
                pictureUrl: getProfile.pictureUrl,
                statusMessage: getProfile.statusMessage
            });

            await axios.post('/user/checkUser', JSON.stringify({
                google_id: data.id,
                line_id: getProfile.userId,
                f_name: data.name.givenName,
                l_name: data.name.familyName,
            }),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }

            ).then((res) => {
                closeLIFF()
            })
        });

    };

    const closeLIFF = () => {
        liff.closeWindow();
    };

    async function authenticate() {


        await axios({
            'method': 'POST',
            'url': '/auth/getToken',
            'headers': {
                'Content-Type': `application/json`,
                'Accept': 'application/json'
            }
        }).then(async (response) => {
            //console.log(response)

            await axios({
                'method': 'GET',
                'url': 'https://classroom.googleapis.com/v1/userProfiles/me',
                'headers': {
                    'Authorization': `Bearer ${response.data.access_token}`,
                    'Accept': 'application/json'
                }
            }).then((res) => {
                getProfile(res.data)
                dispatch(storeGoogleId(res.data.id));
                dispatch(storeToken(response.data.access_token))

                if (res.data.permissions != null) {
                    dispatch(storePermissions(res.data.permissions))
                }
            })


        })

    }

    return <div>{(userLineId) ? userLineId : 'Not ID'}</div>;

};

const AppWithConnect = connect(googleMapState)(Course);
export default AppWithConnect;
