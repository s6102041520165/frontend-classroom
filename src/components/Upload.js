import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Message from './Message';
import Progress from './Progress';
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { useParams, Link } from "react-router-dom";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TurnedInIcon from '@material-ui/icons/TurnedInNot';
import CancelIcon from '@material-ui/icons/Cancel';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { makeStyles, Button, Grid, Paper, MenuList, Card, CardContent, Typography, CardActions, MenuItem } from "@material-ui/core";
import FlatList from "flatlist-react";
import { json } from "body-parser";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    button: {
        margin: 5
    },
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    paper: {
        marginRight: theme.spacing(2),
        marginTop: '20px',
        height: '100%',
    },
    card: {
        minWidth: 275,
        minHeight: 100,
        margin: "10px",
        float: "left"
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
        height: 100,
    },
    input: {
        display: 'none',
    }
}));


const UploadFile = ({ Tokens, GoogleId, dispatch }) => {
    const { courseId } = useParams();//รหัสชั้นเรียน
    const { id } = useParams();//รหัส Assignment
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('');
    const [identifyCourseWork, setIdentityCousrseWork] = useState("");
    const [fileType, setFileType] = useState('');
    const [assignGrade, setAssignGrade] = useState("");
    const [stateCourseWork, setStateCourseWork] = useState("");
    const [courseWork, setCourseWork] = useState("");
    const [assignmentSubmission, setAssignmentSubmission] = useState("");
    const [fileLength, setFileLength] = useState(0);
    const [fileId, setFileId] = useState("");
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const classes = useStyles();

    useEffect(() => {
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        if (!courseWork) {
            listCourseWork();
            getCouseWorkSubmission();
        }
    }, []);

    const renderAssignmentSubmission = (assignmentSubmission, idx) => {
        //console.log(assignmentSubmission);
        return (
            <MenuItem key={`${idx}`} component="a" href={assignmentSubmission.driveFile.alternateLink} style={{ wordWrap: 'break-word;' }}>{assignmentSubmission.driveFile.title}</MenuItem>
        )
    };

    //get course 
    let header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Tokens}`,
        Accept: "application/json"
    };

    const listCourseWork = async () => {

        await axios({
            method: "get",
            url: `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${id}`,
            /* params: {
                courseWorkStates: "PUBLISHED"
            }, */
            headers: header
        }).then(async Response => {
            await setCourseWork(Response.data);
            //console.log(5555)
            //console.log(courseWork)
        });

        //console.log(courseWork)
    };

    const getCouseWorkSubmission = async () => {

        await axios({
            'method': 'GET',
            'url': `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${id}/studentSubmissions?userId=${GoogleId}`,
            'headers': {
                'Authorization': `Bearer ${Tokens}`,
                'Accept': 'application/json'
            }
        }).then((response) => {
            setAssignGrade(response.data.studentSubmissions[0].assignedGrade);
            setStateCourseWork(response.data.studentSubmissions[0].state);
            setIdentityCousrseWork(response.data.studentSubmissions[0].id);
            setAssignmentSubmission(response.data.studentSubmissions[0].assignmentSubmission.attachments);
            console.log(response)
        })

        //console.log(courseWork)
    };


    const onChange = async e => {
        e.preventDefault();

        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
        setFileType(e.target.files[0].type);
        setFileLength(e.target.files.length);

    };

    const heandleReclaim = async e => {
        e.preventDefault()

        e.preventDefault();

        /**
         * 
         * 
         * curl --request POST \
  'https://classroom.googleapis.com/v1/courses/[COURSEID]/courseWork/[COURSEWORKID]/studentSubmissions/[ID]:reclaim?key=[YOUR_API_KEY]' \
  --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{}' \
  --compressed
         */

        try {
            const res = await axios.post(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${id}/studentSubmissions/${identifyCourseWork}:reclaim`, "{}", {
                headers: {
                    'Authorization': `Bearer ${Tokens}`,
                    'Accept': `application/json`,
                    'Content-Type': `application/json`
                },
            }).then((res) => {
                console.log("Test Exceptions Turn In")
                console.log(res)
                if (res.status === 200) {
                    setStateCourseWork("RECLAIMED_BY_STUDENT")
                }
            })


            //console.log(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleTurnIn = async e => {
        e.preventDefault()

        e.preventDefault();

        /**
         * 
         * curl --request POST \
        'https://classroom.googleapis.com/v1/courses/[COURSEID]/courseWork/55022813448/studentSubmissions/Cg4Il5v57oIBEMPCn7DJAQ:turnIn?key=[YOUR_API_KEY]' \
        --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
        --header 'Accept: application/json' \
        --header 'Content-Type: application/json' \
        --data '{}' \
        --compressed
         */

        try {
            const res = await axios.post(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${id}/studentSubmissions/${identifyCourseWork}:turnIn`, "{}", {
                headers: {
                    'Authorization': `Bearer ${Tokens}`,
                    'Accept': `application/json`,
                    'Content-Type': `application/json`
                },
            }).then((res) => {
                console.log("Test Exceptions Turn In")
                console.log(res)
                if (res.status === 200) {
                    setStateCourseWork("TURNED_IN")
                }
            })


            //console.log(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleUpload = async e => {
        //Multipart Form data
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file)
        console.log(formData)



        try {
            const res = await axios.post('/auth/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
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
            }).then((res) => {

                const jsonbody = {
                    "addAttachments": [
                        {
                            "driveFile": {
                                "id": res.data.id
                            }
                        },
                    ]
                }
                console.log(jsonbody)

                getCouseWorkSubmission().then(async (response) => {
                    console.log(identifyCourseWork)
                    await axios({
                        method: "POST",
                        url: `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${id}/studentSubmissions/${identifyCourseWork}:modifyAttachments`,
                        'headers': {
                            'Authorization': `Bearer ${Tokens}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            "addAttachments": [
                                {
                                    "driveFile": {
                                        "id": res.data.id
                                    }
                                },
                            ]
                        })
                    }).then(async (Response) => {
                        console.log(Response)
                        setAssignmentSubmission(Response.data.assignmentSubmission.attachments);
                    })
                })
            }).then(async () => {
                console.log('End Process')
            });


            //console.log(res.data)

        } catch (error) {
            if (error.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(error.response.data.msg);
            }
        }

        //formData.append('name', `${filename}`);
        //formData.append('mimeType', `${fileType}`);


    }

    return (
        <Fragment>
            {message ? <Message msg={message} /> : null}
            <h2>Student Submissions</h2>

            {(assignGrade) ? <b>Assigned Grade : {assignGrade}</b> : ""}


            <Paper className={classes.paper}>
                <MenuList>
                    <FlatList list={assignmentSubmission} renderItem={renderAssignmentSubmission} />
                </MenuList>
            </Paper>
            <br />

            <form encType="multipart/form-data" onSubmit={handleUpload}
            >
                <div className='custom-file mb-4' style={{ padding: '5px', width: '100%', minHeight: '100px', backgroundColor: 'whitesmoke' }}>

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
                        type="file"
                        onChange={onChange}
                    />
                    <label htmlFor="contained-button-file">

                        <Button variant="contained" color="secondary" startIcon={<AttachFileIcon />} component="span" className={classes.button} >
                            Choose File
                        </Button><br />
                        {(filename != "") ? <h4>{filename}</h4> : ""}
                    </label>
                </div>

                <Progress percentage={uploadPercentage} />

                <Button variant="contained" disabled={stateCourseWork == "TURNED_IN" ? true : ""} startIcon={<CloudUploadIcon />} onClick={handleUpload} color="warning" component="span" className={classes.button}>Upload File</Button>


                {(stateCourseWork == "TURNED_IN")
                    ? (
                        <Button variant="contained"
                            startIcon={<CancelIcon />} onClick={heandleReclaim} color="primary" component="span" className={classes.button}>Reclaim</Button>)
                    : (
                        <Button variant="contained"
                            startIcon={<TurnedInIcon />} onClick={handleTurnIn} color="primary" component="span" className={classes.button}>Turn In</Button>
                    )}
            </form>
            {/*fileId ? (
                <div className='row mt-5'>
                    <div className='col-md-6 m-auto'>
                        <h3 className='text-center'>{uploadedFile.fileName}</h3>
                        <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                    </div>
                </div>
            ) : null*/}
        </Fragment >
    );
};

const AppWithConnect = connect(googleMapState)(UploadFile);
export default AppWithConnect;
