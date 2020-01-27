import React, { Component, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import FlatList from "flatlist-react";
import Select from "react-select";
import {
  FormControl,
  InputLabel,
  MenuItem,
  makeStyles,
  ListItem,
  List,
  ListItemText,
  Divider,
  Menu,
  MenuList,
  Paper,
} from "@material-ui/core";
import { storeToken, storeGoogleId } from "../reducers/actions";
import { Link } from "react-router-dom";

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
    marginRight: theme.spacing(2)
  }
}));

const renderCourse = (course, idx) => {
  console.log(course);
  return <MenuItem key={`${course.id}-${idx}`} to={`/course/${course.id}`} component={Link}>{course.name}</MenuItem>;
};

const Coursework = ({ message, Tokens, GoogleId, dispatch }) => {
  const [courses, setCourses] = useState("");
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
        teacherId: GoogleId
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
          setCourses(Response.data.courses);
        } catch (err) {
          console.log(err);
        }
        //Catche Error Status
      })
      .catch(err => {
        if (err.response.status == 401) {
          dispatch(storeToken(""));
          dispatch(storeGoogleId(""));
        }
      });
  };

  return (
    <div id="create-course">
      <Paper className={classes.paper}>
        <MenuList>
          <FlatList list={courses} renderItem={renderCourse} />
        </MenuList>
        
      </Paper>
    </div>
  );
};

const AppWithConnect = connect(googleMapState)(Coursework);
export default AppWithConnect;
