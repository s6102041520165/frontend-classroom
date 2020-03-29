import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import FlatList from "flatlist-react";
import {
  MenuItem,
  makeStyles,
  MenuList,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import { storeToken, storeGoogleId } from "../reducers/actions";
import { Link } from "react-router-dom";
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SaveIcon from '@material-ui/icons/Save';


const initialState = {
  courseId: "",
  userId: "",
  role: ""
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
  paper: {
    marginRight: theme.spacing(2),
    marginTop: '20px',
    height: '100%',
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
  { icon: <SaveIcon />, name: 'Create Course', uri: '/create-course' },
];

const renderCourse = (course, idx) => {
  //console.log(course);
  return <MenuItem key={`${course.id}-${idx}`} to={`/course/${encodeURI(course.id)}`} component={Link} style={{ wordWrap: 'break-word;' }}>{course.name}</MenuItem>;
};

const Course = ({ message, Tokens, GoogleId, dispatch }) => {
  const [courses, setCourses] = useState("");
  const [direction, setDirection] = React.useState('up');
  const [openDial, setOpenDial] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!courseId) {
      listCourse();
    }
  }, []);
  const [{ courseId, userId, role }, setState] = useState(initialState);

  const clearState = () => {
    setState({ ...initialState });
  };

  const classes = useStyles();

  const onChange = e => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
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

  let header = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Tokens}`,
    Accept: "application/json"
  };

  const listCourse = async () => {
    await axios({
      method: "get",
      url: "https://classroom.googleapis.com/v1/courses",
      params: {
        courseStates: "ACTIVE",
        //teacherId: GoogleId
      },
      headers: header
    })
      .then(async Response => {
        /*
      let itemCourse = [];
      Response.data.courses.forEach(item => {
        itemCourse.push({ value: item.id, label: item.name });
      });
      */
        try {
          console.log(Response.data)
          setCourses(Response.data.courses);
          setLoaded(true)
        } catch (err) {
          console.log(err);
        }
        //Catche Error Status
      })
      .catch(err => {
        try {
          if (err.response.status == 401) {
            dispatch(storeToken(""));
            dispatch(storeGoogleId(""));
          } else if (err.response.status == 404) {
            console.log("Not Found !!!");
          }
        } catch (message) {
          console.log("Network Error ! Please connected network")
          console.log(message);

        }
      });
  };

  return (loaded === true) ? (
    <div id="create-course">
      <Paper className={classes.paper}>
        <MenuList>
          <FlatList list={courses} renderItem={renderCourse} />
        </MenuList>
      </Paper>
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
