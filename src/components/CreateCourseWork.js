import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { useParams } from "react-router-dom";

const initialState = {
  title: "",
  maxPoints: "",
  room: "",
  googleId: ""
};

const CreateCourse = ({ message, Tokens, GoogleId, dispatch }) => {
  const { courseId } = useParams();
  const [{ title, maxPoints, room }, setState] = useState(initialState);

  const clearState = () => {
    setState({ ...initialState });
  };

  const onChange = e => {
    const { name, value } = e.target;
    //console.log({[title]:value});

    //Set state from input value
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    //console.log(event);

    const classroom = {
      title: title,
      maxPoints: maxPoints,
      room: room,
      googleId: GoogleId
    };

    //console.log(classroom);
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Tokens}`
    };
    /** */
    axios
      .post(
        `https://classroom.googleapis.com/v1/courses/${decodeURI(courseId)}/courseWork`,
        JSON.stringify(classroom),
        {
          headers: headers
        }
      )
      .then(response => {
        // handle success
        console.log(response);
        clearState();
      })

      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {});
    /**/
  };

  return (
    <div id="create-course">
      <h1>Create Course Work</h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <p>
          <TextField
            name="title"
            value={title}
            onChange={onChange}
            style={{ width: "80%" }}
            label="Course title"
          />
        </p>
        <p>
          <TextField
            name="maxPoints"
            value={maxPoints}
            onChange={onChange}
            style={{ width: "80%" }}
            label="maxPoints"
          />
        </p>
        
        <p>
          <Button type="submit" variant="contained" color="primary">
            Create course work.
          </Button>
        </p>
      </form>
    </div>
  );
};

const AppWithConnect = connect(googleMapState)(CreateCourse);
export default AppWithConnect;
