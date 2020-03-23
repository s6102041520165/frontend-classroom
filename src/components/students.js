import React, { Component, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import FlatList from "flatlist-react";
import Select from "react-select";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Divider from '@material-ui/core/Divider';
import {
  FormControl,
  InputLabel,
  MenuItem,
  makeStyles,
  ListItem,
  List,
  ListItemText,
  Divider
} from "@material-ui/core";

const initialState = {
  courseId: "",
  userId: "",
  role: ""
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const renderPerson = (course, idx) => {
  console.log(idx);
  return (
    <MenuItem key={course.id} value={course.id}>
      {course.name}
    </MenuItem>
  );
};

const Invitation = ({ message, Tokens, GoogleId, dispatch }) => {
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
    //console.log({[name]:value});
    console.log(e.target);
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  let header = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Tokens}`,
    Accept: "application/json"
  };

  const listCourse = async () => {
    /**
     * 
     * 
     curl \
  'https://classroom.googleapis.com/v1/courses?key=[YOUR_API_KEY]' \
  --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
  --header 'Accept: application/json' \
  --compressed
     */
    /** */
    await axios({
      method: "get",
      url: "https://classroom.googleapis.com/v1/courses",
      params: {
        courseStates: "ACTIVE",
        teacherId: GoogleId
      },
      headers: header
    }).then(async Response => {
      let itemCourse = [];
      Response.data.courses.forEach(item => {
        itemCourse.push({ value: item.id, label: item.name });
      });
      console.log(itemCourse);
      setCourses(itemCourse);
    });
  };

  console.log(courses);

  const handleSubmit = async e => {
    e.preventDefault();

    let data = {
      courseId: courseId,
      userId: userId,
      role: role,
    }

    await axios({
      method: "post",
      url: "https://classroom.googleapis.com/v1/invitations",
      data: data,
      headers: header
    }).then(async Response => {
      console.log(Response)
    });
    console.log(courseId);
  };

  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Photos" secondary="Jan 9, 2014" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Work" secondary="Jan 7, 2014" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Vacation" secondary="July 20, 2014" />
      </ListItem>
    </List>
  );
};

const AppWithConnect = connect(googleMapState)(Invitation);
export default AppWithConnect;
