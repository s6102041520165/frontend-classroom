import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Message from './Message';
import Progress from './Progress';
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { useParams, Link } from "react-router-dom";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles, Button, Grid, Paper, MenuList, Card, CardContent, Typography, CardActions } from "@material-ui/core";
import FlatList from "flatlist-react";

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
    input: {
        display: 'none',
    }
}));


const UploadFile = ({ Tokens, GoogleId, dispatch }) => {
    const { courseId } = useParams();//รหัสชั้นเรียน
    const { id } = useParams();//รหัส Assignment
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('');
    const [identifyCourseWork, setIdentityCousrseWork] = useState();
    const [fileType, setFileType] = useState('');
    const [courseWork, setCourseWork] = useState("");
    const [assignmentSubmission, setAssignmentSubmission] = useState("");
    const [fileLength, setFileLength] = useState(0);
    const [uploadedFile, setUploadedFile] = useState({});
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
        return (<Grid item xs={12} sm={12} md={4} lg={3}>
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                    <img src={assignmentSubmission.driveFile.thumbnailUrl} style={{ maxWidth: "200px" }} />
                </CardContent>
                <Typography variant="h5" component="h2">
                    {assignmentSubmission.driveFile.title}
                </Typography>
                {/*<CardActions>
                    <Button
                        to={`/course-work/${encodeURI(courseWork.courseId)}/details/${encodeURI(courseWork.id)}`}
                        component={Link}
                        variant="contained"
                        color="primary"
                        style={{ margin: 'auto' }}
                    >
                        Details
                </Button>
                </CardActions>*/}
            </Card>
        </Grid>)
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
        }).then(async (response) => {
            await setIdentityCousrseWork(response.data.studentSubmissions[0].id);
            await setAssignmentSubmission(response.data.studentSubmissions[0].assignmentSubmission.attachments);
            await console.log(response)
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

    const handleUpload = async e => {
        //Multipart Form data
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file)
        console.log(formData)



        try {
            const res = await axios.post('/upload', formData, {
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
            });
            const { fileName, filePath } = res.data

            setUploadedFile({ fileName, filePath })
        } catch (error) {
            if (error.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(error.response.data.msg);
            }
        }

        //formData.append('name', `${filename}`);
        //formData.append('mimeType', `${fileType}`);

        try {/*
            const res = await axios.post('/upload', formData, {
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
            });

            const { fileName, filePath } = res.data

            setUploadedFile({ fileName, filePath })
            await axios({
                url: `/upload`,
                headers: {
                    //'Authorization': `Bearer ${Tokens}`,
                    'Content-Type': `multipart/form-data`,
                },
                data: formData,

            }).then(async Response => {

                const { fileName, filePath } = Response.data
                console.log(Response.data)

                setUploadedFile({ fileName, filePath });
                //console.log(5555)
                /*console.log(Response.data)
                let driveId = await Response.data.id;
                let jsonBody = {
                    "addAttachments": [
                        {
                            "driveFile": {
                                "id": driveId
                            }
                        },
                    ]
                }
                
                await getCouseWorkSubmission().then(async (res) => {
                    await axios({
                        method: "POST",
                        url: `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${id}/studentSubmissions/${identifyCourseWork}:modifyAttachments`,
                        'headers': {
                            'Authorization': `Bearer ${Tokens}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(jsonBody)
                    }).then(async (Response) => {
                        setAssignmentSubmission(Response.data.assignmentSubmission.attachments);
                    })
                })
                //console.log(formData)
                
            });*/
            //console.log()

        } catch (error) {
            if (error.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(error.response.data.msg);
            }
        }
    }

    return (
        <Fragment>
            {message ? <Message msg={message} /> : null}
            <h2>Student Submissions</h2>

            <Grid container spacing={3}>
                <MenuList>
                    <FlatList list={assignmentSubmission} renderItem={renderAssignmentSubmission} />
                </MenuList>
            </Grid>
            <br />

            <form encType="multipart/form-data" onSubmit={handleUpload}
            >
                <div className='custom-file mb-4' style={{ padding: '5px', width: '100%', minHeight: '200px', backgroundColor: 'whitesmoke' }}>

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

                <Button variant="contained" onClick={handleUpload} color="primary" component="span" className={classes.button}>Upload File</Button>

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
