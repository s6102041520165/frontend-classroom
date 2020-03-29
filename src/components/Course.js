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
import AssignmentIcon from "@material-ui/icons/Assignment";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import BookIcon from "@material-ui/icons/Book";
import ListIcon from "@material-ui/icons/List";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import { makeStyles, Button, Grid, CircularProgress } from "@material-ui/core";
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
}));

const Course = ({ message, Tokens, GoogleId, dispatch }) => {
  let { id } = useParams();
  const [courseWork, setCourseWork] = useState("");
  const [direction, setDirection] = React.useState("up");
  const [openDial, setOpenDial] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!courseWork) {
      listCourse();
      console.log(id)
    }
  }, []);

  const clearState = () => {
    setCourseWork(null);
  };

  const actions = [
    {
      icon: <AssignmentIcon />,
      name: "Assignment",
      uri: `/create-assignment/${id}`,
    }, {
      icon: <ListIcon />,
      name: "Topic",
      uri: `/create-topic/${id}`,
    },
  ];
  /**
   * const actions = [
    {
      icon: <AssignmentIcon />,
      name: "Assignment",
      uri: `/create-assignment/${id}`,
    },{
      icon: <LiveHelpIcon />,
      name: "Question",
      uri: `/create-question/${id}`,
    },{
      icon: <BookIcon />,
      name: "Books",
      uri: `/create-material/${id}`,
    },{
      icon: <ListIcon />,
      name: "Topic",
      uri: `/create-topic/${id}`,
    },
  ];
   */

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
      url: `https://classroom.googleapis.com/v1/courses/${decodeURI(id)}/courseWork`,
      params: {
        courseWorkStates: "PUBLISHED"
      },
      headers: header
    }).then(async Response => {
      setCourseWork(Response.data.courseWork);
      setLoaded(true)
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
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
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
              to={`/course-work/${encodeURI(courseWork.courseId)}/details/${encodeURI(courseWork.id)}`}
              component={Link}
              variant="contained"
              color="primary"
              style={{ margin: 'auto' }}
            >
              Details
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  return (loaded === true) ? (
    <div id="course">
      <Grid container spacing={3}>
        <FlatList list={courseWork} renderItem={renderCourse} />
      </Grid>
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
  ) : (
      <div><CircularProgress color="secondary" /></div>
    )
};

const AppWithConnect = connect(googleMapState)(Course);
export default AppWithConnect;
