import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Message from './Message';
import Progress from './Progress';
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { useParams, Link } from "react-router-dom";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles, Button, Grid } from "@material-ui/core";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

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
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));

const UploadFile = ({ Tokens, GoogleId, dispatch }) => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [fileType, setFileType] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const classes = useStyles();

    const onChange = async e => {
        e.preventDefault();
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
        setFileType(e.target.files[0].type);

        let lengthFile = e.target.files.length
        const formData = new FormData();
        formData.append('file', file);
        console.log(e.target.files)

        try {
            const res = await axios.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', formData, {
                headers: {
                    'Authorization': `Bearer ${Tokens}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Upload-Content-Type': 'image/jpeg'
                },
                onUploadProgress: progressEvent => {
                    setUploadPercentage(
                        parseInt(
                            Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        )
                    );

                    // Clear percentage
                    setTimeout(() => setUploadPercentage(0), 10000);
                }
            });

            const { fileName, filePath } = res.data;

            setUploadedFile({ fileName, filePath });

            setMessage('File Uploaded');
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    return (
        <Fragment>
            {message ? <Message msg={message} /> : null}
            <form>
                <div className='custom-file mb-4'>
                    {/*<input
                        type='file'
                        className='contained-button-file'
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={onChange}
                    />*/}
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={onChange}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="secondary" component="span" className={classes.button} startIcon={<CloudUploadIcon />}>
                            Choose Files
                        </Button>
                    </label>
                </div>

                <Progress percentage={uploadPercentage} />

            </form>
            {uploadedFile ? (
                <div className='row mt-5'>
                    <div className='col-md-6 m-auto'>
                        <h3 className='text-center'>{uploadedFile.fileName}</h3>
                        <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                    </div>
                </div>
            ) : null}
        </Fragment>
    );
};

const AppWithConnect = connect(googleMapState)(UploadFile);
export default AppWithConnect;
