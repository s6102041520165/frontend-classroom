import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { useParams, Link } from "react-router-dom";
import FlatList from "flatlist-react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import AssignmentIcon from '@material-ui/icons/Assignment';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import {
  MenuItem,
  makeStyles,
  Menu,
  MenuList,
  Paper,
  Button
} from "@material-ui/core";
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
   position: 'relative',
 },
 speedDial: {
   position: 'fixed',
   '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
     bottom: theme.spacing(5),
     right: theme.spacing(2),
   },
   '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
     top: theme.spacing(2),
     left: theme.spacing(2),
   },
 },
}));

const actions = [
  { icon: <AssignmentIcon />, name: 'Create Course', uri: '/create-course' },
];

const Course = ({ message, Tokens, GoogleId, dispatch }) => {
  let { id } = useParams();
  const [courseWork, setCourseWork] = useState("");
  const [direction, setDirection] = React.useState('up');
  const [openDial, setOpenDial] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!courseWork) {
      listCourse();
    }
  }, []);

  const clearState = () => {
    setCourseWork(null);
  };

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  let header = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Tokens}`,
    Accept: "application/json"
  };

  const listCourse = async () => {
    await axios({
      method: "get",
      url: `https://classroom.googleapis.com/v1/courses/${id}/courseWork`,
      params: {
        courseWorkStates: "PUBLISHED"
      },
      headers: header
    }).then(async Response => {
      setCourseWork(Response.data.courseWork);
    });
  };

  //Speed Dial Start
  const handleDirectionChange = event => {
    setDirection(event.target.value);
  };

  const handleHiddenChange = event => {
    setHidden(event.target.checked);
  };

  const handleClose = () => {
    setOpenDial(false);
  };

  const handleOpen = () => {
    setOpenDial(true);
  };
  //Speed Dial Ending


  const handleSubmit = async e => {
    e.preventDefault();
  };

  const renderCourse = (courseWork, idx) => {
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Max Points: {courseWork.maxPoints}
          </Typography>
          <Typography variant="h5" component="h2">
            {courseWork.title}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            to={`/course/${courseWork.courseId}/details/${courseWork.id}`}
            component={Link}
          >
            Details
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <div id="course">
      <FlatList list={courseWork} renderItem={renderCourse} />
      <div className={classes.exampleWrapper}>
        <SpeedDial
          ariaLabel="Options"
          className={classes.speedDial}
          hidden={hidden}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={openDial}
          direction={direction}
        >
          {actions.map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={handleClose}
              to={action.uri}
              component={Link}
            />
          ))}
        </SpeedDial>
      </div>
    </div>
  );
};

const AppWithConnect = connect(googleMapState)(Course);
export default AppWithConnect;
