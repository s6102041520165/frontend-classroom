import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import Select from "react-select";
import { useParams, Link } from "react-router-dom";
import FlatList from "flatlist-react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { MenuItem, makeStyles, Menu, MenuList, Paper } from "@material-ui/core";

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
  }
}));

const Course = ({ message, Tokens, GoogleId, dispatch }) => {
  let { id } = useParams();
  const [courseWork, setCourseWork] = useState("");
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

  console.log(courseWork);

  const handleSubmit = async e => {
    e.preventDefault();
  };

  const renderCourse = (courseWork, idx) => {
    return (
      <MenuItem key={`${courseWork.id}-${idx}`}>
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
            <Typography className={classes.pos} color="textSecondary">
              {courseWork.description}
            </Typography>
          </CardContent>
          <CardActions>
            
          </CardActions>
        </Card>
      </MenuItem>
    );
  };

  return (
    <MenuList>
      <div id="course">
        <FlatList list={courseWork} renderItem={renderCourse} />
      </div>
    </MenuList>
  );
};

const AppWithConnect = connect(googleMapState)(Course);
export default AppWithConnect;
