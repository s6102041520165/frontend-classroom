import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import Select from "react-select";
import {
  FormControl,
  InputLabel,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";

const initialState = {
  courseId: "",
  userId: "",
  role: ""
};

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: '80%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),

    },
  }
}));

const Invitation = ({ message, Tokens, GoogleId, dispatch }) => {
  const [courses, setCourses] = useState("");
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
      setLoaded(true)
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

  return (loaded === true) ? (
    <div id="create-course">
      <h1>Invitation</h1>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <p>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Course</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              name="courseId"
              onChange={async e => {
                //console.log({[name]:value});
                await setState(prevState => ({ ...prevState, courseId: e.value }));
                console.log(courseId);
              }}
              options={courses}
            />
          </FormControl>
        </p>
        <p>
          <TextField
            name="userId"
            value={userId}
            onChange={onChange}
            style={{ width: "80%" }}
            label="Email"
          />
        </p>

        <p>

          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label" style={{ width: '80%' }}>Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              name="role"
              style={{ width: '80%' }}
              options={[
                { value: "STUDENT", label: "STUDENT" },
                { value: "TEACHER", label: "TEACHER" }
              ]}
              onChange={async e => {
                //console.log({[name]:value});
                await setState(prevState => ({ ...prevState, role: e.value }));
                console.log(role);
              }}
            />
          </FormControl>
        </p>
        <p>
          <Button type="submit" variant="contained" color="primary">
            Invite
          </Button>
        </p>
      </form>
    </div>
  ) : (
      <div><CircularProgress color="secondary" /></div>
    )
};

const AppWithConnect = connect(googleMapState)(Invitation);
export default AppWithConnect;
