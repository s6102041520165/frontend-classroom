import React, { useState, useEffect, Fragment } from "react";
import { storeToken, storeGoogleId } from "../reducers/actions";
import axios from "axios";
import Message from './Message';
import Progress from './Progress';
import dialog from './dialog';
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { useParams, Link } from "react-router-dom";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TurnedInIcon from '@material-ui/icons/TurnedInNot';
import CancelIcon from '@material-ui/icons/Cancel';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SaveAltOutlinedIcon from '@material-ui/icons/SaveAltOutlined';
import { makeStyles, Button, Grid, Paper, MenuList, Card, CardContent, Typography, CardActions, MenuItem, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@material-ui/core";
import FlatList from "flatlist-react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import SendBot from "./SendBot";

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
        //maxWidth: 360,
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


const initialState = {
    score: "",
};

// Line Frontend Framework Init
const liff = window.liff;

//Initial state
const initialStateLine = {
    name: "",
    userLineId: "",
    statusMessage: "",
    pictureUrl: ""
};

const UploadFile = ({ Tokens, GoogleId, dispatch }) => {
    const { courseId } = useParams(); //รหัสชั้นเรียน
    const { id } = useParams(); //รหัส Assignment
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('');
    const [identifyCourseWork, setIdentityCousrseWork] = useState("");
    const [fileType, setFileType] = useState('');
    const [profileTeacher, setProfileTeacher] = useState("");
    const [students, setStudents] = useState([]);
    const [assignGrade, setAssignGrade] = useState("");
    const [stateCourseWork, setStateCourseWork] = useState("");
    const [courseWork, setCourseWork] = useState("");
    const [assignmentSubmission, setAssignmentSubmission] = useState("");
    const [fileLength, setFileLength] = useState(0);
    const [fileId, setFileId] = useState("");
    const [{ score }, setScore] = useState(initialState);
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [{ name, userLineId, statusMessage, pictureUrl }, setStateLine] = useState(
        initialStateLine
    );


    const classes = useStyles();

    useEffect(() => {
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        if (!userLineId) {
            getProfile();
        }
        if (!courseWork) {
            listCourseWork();
            getCouseWorkSubmission();
            listStudents()
            getTeacher()
        }
    }, []);



    const sendMessage = (message) => {
        liff
            .sendMessages([{
                type: "text",
                text: message
            }])
            .then(() => {
                liff.closeWindow();
            });
    };

    const closeLIFF = () => {
        liff.closeWindow();
    };

    /// Dialog Show and not show
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //งานที่ส่ง Render เป็น JSX
    const renderAssignmentSubmission = (assignmentSubmission, idx) => {
        //console.log(assignmentSubmission);
        return (<MenuItem key={`${idx}`}
            component="a"
            href={assignmentSubmission.driveFile.alternateLink}
            style={{ wordWrap: 'break-word;' }}> {assignmentSubmission.driveFile.title}</MenuItem>
        )
    };

    //get course 
    let header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Tokens}`,
        Accept: "application/json"
    };


    //งานในชั้นเรียนทั้งหมด
    const listCourseWork = async () => {

        await axios({
            method: "get",
            url: `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${id}`,
            /* params: {
                courseWorkStates: "PUBLISHED"
            }, */
            headers: header
        }).then(async Response => {
            if (Response.status === 200)
                await setCourseWork(Response.data);
            else if (Response.status == 401) {
                dispatch(storeToken(""));
                dispatch(storeGoogleId(""));
            } else if (Response.status == 404) {
                console.log("Not Found !!!");
            }
            //console.log(5555)
            //console.log(courseWork)
        });

        //console.log(courseWork)
    };

    //ดูสถานะตัวเองว่าเป็นผู้สอนหรือไม่
    const getTeacher = async () => {
        /**
         * 
         * curl \
        'https://classroom.googleapis.com/v1/courses/50850977478/teachers/me?key=[YOUR_API_KEY]' \
        --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
        --header 'Accept: application/json' \
        --compressed
         */
        try {
            await axios.get(`https://classroom.googleapis.com/v1/courses/${courseId}/teachers/${GoogleId}`, {
                headers: {
                    "Authorization": `Bearer ${Tokens}`,
                    "Accept": `application/json`
                }
            }).then((response) => {
                if (response.status === 200)
                    setProfileTeacher(response.data)
                else if (response.status == 401) {
                    dispatch(storeToken(""));
                    dispatch(storeGoogleId(""));
                } else if (response.status == 404) {
                    console.log("Not Found !!!");
                }

            })
        } catch (error) {
            //console.log(error)
        }
    }

    //ดูนักเรียนในชั้นเรียน
    const listStudents = async () => {
        /**
         * 
         * curl \
        'https://classroom.googleapis.com/v1/courses/50850977478/students?key=[YOUR_API_KEY]' \
        --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
        --header 'Accept: application/json' \
        --compressed
         */

        try {
            const res = await axios.get(`https://classroom.googleapis.com/v1/courses/${courseId}/students`, {
                headers: {
                    "Authorization": `Bearer ${Tokens}`,
                    "Accept": `application/json`
                }
            }).then((response) => {
                if (response.status == 401) {
                    dispatch(storeToken(""));
                    dispatch(storeGoogleId(""));
                } else if (response.status == 404) {
                    console.log("Not Found !!!");
                } else {
                    setStudents(response.data.students)
                    console.log(response.data.students)
                }

            })
        } catch (error) {
            console.log(error)
        }
    }

    const getProfile = () => {
        liff.init(async () => {
            let getProfile = await liff.getProfile();
            setStateLine({
                name: getProfile.displayName,
                userLineId: getProfile.userId,
                pictureUrl: getProfile.pictureUrl,
                statusMessage: getProfile.statusMessage
            });

            await axios.post('/user/updateUser', JSON.stringify({
                line_id: getProfile.userId,
            }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log(res)
            })
        });
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
            if (response.status === 200) {
                if (response.data.studentSubmissions) {
                    setAssignGrade(response.data.studentSubmissions[0].assignedGrade);
                    setStateCourseWork(response.data.studentSubmissions[0].state);
                    setIdentityCousrseWork(response.data.studentSubmissions[0].id);
                    setAssignmentSubmission(response.data.studentSubmissions[0].assignmentSubmission.attachments);
                    console.log(response)

                }
            } else if (response.status == 401) {
                dispatch(storeToken(""));
                dispatch(storeGoogleId(""));
            } else if (response.status == 404) {
                console.log("Not Found !!!");
            }
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
                } else if (res.status == 401) {
                    dispatch(storeToken(""));
                    dispatch(storeGoogleId(""));
                } else if (res.status == 404) {
                    console.log("Not Found !!!");
                }
            })


            //console.log(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleTurnIn = async e => {
        e.preventDefault()

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
            await axios.post(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${id}/studentSubmissions/${identifyCourseWork}:turnIn`, "{}", {
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
                    sendMessage('ส่งงานเรียบร้อย')
                } else if (res.status == 401) {
                    dispatch(storeToken(""));
                    dispatch(storeGoogleId(""));
                } else if (res.status == 404) {
                    console.log("Not Found !!!");
                }
            })


            //console.log(res.data)

        } catch (error) {

        }
    }

    const handleUpload = async e => {
        //Multipart Form data
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file)
        //console.log(formData)



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
                    "addAttachments": [{
                        "driveFile": {
                            "id": res.data.id
                        }
                    },]
                }
                //console.log(jsonbody)

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
                            "addAttachments": [{
                                "driveFile": {
                                    "id": res.data.id
                                }
                            },]
                        })
                    }).then(async (Response) => {
                        //console.log(Response)
                        if (Response.status === 200)
                            setAssignmentSubmission(Response.data.assignmentSubmission.attachments);
                        else if (Response.status == 401) {
                            dispatch(storeToken(""));
                            dispatch(storeGoogleId(""));
                        } else if (Response.status == 404) {
                            console.log("Not Found !!!");
                        }
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

    const handleClick = async (e, userId) => {
        e.preventDefault();

        //console.log(userId)


        await axios({
            'method': 'GET',
            'url': `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${id}/studentSubmissions?userId=${userId}`,
            'headers': {
                'Authorization': `Bearer ${Tokens}`,
                'Accept': 'application/json'
            }
        }).then((response) => {
            if (response.status === 200) {
                if (response.data.studentSubmissions) {
                    setAssignGrade(response.data.studentSubmissions[0].assignedGrade);
                    setStateCourseWork(response.data.studentSubmissions[0].state);
                    setIdentityCousrseWork(response.data.studentSubmissions[0].id);
                    setAssignmentSubmission(response.data.studentSubmissions[0].assignmentSubmission.attachments);
                    //console.log(response)

                } else if (response.status == 401) {
                    dispatch(storeToken(""));
                    dispatch(storeGoogleId(""));
                } else if (response.status == 404) {
                    console.log("Not Found !!!");
                }
            }
            //console.log(response)
        })

    }


    //ล้างค่าในฟอร์ม
    const clearState = () => {
        setScore({ ...initialState });
    };

    //Handle Assign Score
    //ให้คะแนนนักเรียน
    const handleAssignGrade = async (e) => {
        e.preventDefault()
        //console.log(score)
        await axios.patch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${id}/studentSubmissions/${identifyCourseWork}?updateMask=assignedGrade`,
            JSON.stringify({
                assignedGrade: score
            }), {
            headers: {
                'Authorization': `Bearer ${Tokens}`,
                'Accept': `application/json`,
                'Content-Type': `application/json`
            },
        }).then((response) => {
            if (response.status === 200) {
                //console.log("Updated successfully!")
                setAssignGrade(score)
                clearState()
                handleClose()
                sendMessage('เพิ่มคะแนนสำเร็จ')
            }
        })
    }

    //รับค่าคะแนน
    const handleChange = (e) => {
        //e.preventDefault()
        const { name, value } = e.target;

        //console.log({ [name]: value });

        //Set state from input value
        setScore(prevState => ({ ...prevState, [name]: value }));
    }

    //
    const renderStudents = (students, idx) => {
        return (

            <MenuItem key={`${students.profile.id}}-${idx}`}
                onClick={event => handleClick(event, students.userId)} >
                <ListItem >
                    <ListItemAvatar >
                        <Avatar> </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={students.profile.name.fullName} />
                </ListItem>

            </MenuItem>
        )
    }

    //เมื่อผู้ใช้เป็นผู้สอนให้ทำการแสดงนักเรียนทุกคน
    const StudentsComponent = () => {
        return (<Paper className={classes.paper} >
            <MenuList className={classes.root} >
                <FlatList list={students}
                    renderItem={renderStudents}
                />
            </MenuList>
        </Paper>)
    }

    console.log(profileTeacher)

    return (<Fragment> {
        (userLineId) ? < SendBot line_id="test" /> : ""} {
            (profileTeacher != "") ? < StudentsComponent /> : ""} {
            message ? < Message msg={message}
            /> : null} {
            (identifyCourseWork !== "") ? (<h2 > Student Submissions </h2>
            ) : ""
        }


        {
            (assignGrade) ? < b > Assigned Grade: {assignGrade} </b> : ""} {
            (profileTeacher !== "" && identifyCourseWork !== "") ?
                (<Button variant="contained"
                    startIcon={< SaveAltOutlinedIcon />}
                    onClick={handleClickOpen}
                    color="primary"
                    component="span"
                    className={classes.button} >
                    Assign Score </Button>) : ""
        } { /**Dialog Show */} <Dialog open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title" >
            <DialogTitle id="form-dialog-title" > Assign Score </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter a score. </DialogContentText> <
                    TextField
                    name="score"
                    onChange={handleChange}
                    value={score}
                /> </DialogContent> <DialogActions>
                <Button onClick={handleClose}
                    color="primary" >
                    Cancel </Button> <Button onClick={handleAssignGrade}
                    color="primary" >
                    Save </Button> </DialogActions> </Dialog>

        {
            (identifyCourseWork !== "") ? (<div>
                <Paper className={classes.paper} >
                    <MenuList >
                        <
                            FlatList list={assignmentSubmission}
                            renderItem={renderAssignmentSubmission}
                        /> </MenuList> </Paper> <br />

                {
                    (profileTeacher === "") ? (<form encType="multipart/form-data"
                        onSubmit={handleUpload} >
                        <div className='custom-file mb-4'
                            style={
                                { padding: '5px', width: '100%', minHeight: '100px', backgroundColor: 'whitesmoke' }} >

                            {
                                /*<input
                                                        type='file'
                                                        className='contained-button-file'
                                                        id="contained-button-file"
                                                        multiple
                                                        type="file"
                                                        onChange={onChange}
                                                    />*/
                            } <input accept="image/*"
                                className={classes.input}
                                id="contained-button-file"
                                type="file"
                                onChange={onChange}
                            /> <label htmlFor="contained-button-file" >

                                <Button variant="contained"
                                    color="secondary"
                                    startIcon={< AttachFileIcon />}
                                    component="span"
                                    className={classes.button} >
                                    Choose File </Button><br /> {
                                    (filename != "") ? <h4> {filename} </h4> : ""} </label> </div>

                        <Progress percentage={uploadPercentage} />

                        <Button variant="contained"
                            disabled={stateCourseWork == "TURNED_IN" ? true : ""}
                            startIcon={< CloudUploadIcon />}
                            onClick={handleUpload}
                            color="warning"
                            component="span"
                            className={classes.button} > Upload File </Button>


                        {
                            (stateCourseWork == "TURNED_IN") ?
                                (<Button variant="contained"
                                    startIcon={< CancelIcon />}
                                    onClick={heandleReclaim}
                                    color="primary"
                                    component="span"
                                    className={classes.button} > Reclaim </Button>) : (<Button variant="contained"
                                        startIcon={< TurnedInIcon />}
                                        onClick={handleTurnIn}
                                        color="primary"
                                        component="span"
                                        className={classes.button} > Turn In </Button>
                                )
                        } </form>) : ""} </div>) : ""
        } {
            /*fileId ? (
                            <div className='row mt-5'>
                                <div className='col-md-6 m-auto'>
                                    <h3 className='text-center'>{uploadedFile.fileName}</h3>
                                    <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                                </div>
                            </div>
                        ) : null*/
        }


    </Fragment>)
}

const AppWithConnect = connect(googleMapState)(UploadFile);
export default AppWithConnect;