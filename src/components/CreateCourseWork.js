import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { useParams } from "react-router-dom";
import Select from "react-select";

const initialState = {
  title: "",
  maxPoints: "",
  state: "",
};

const stateAssignment = [
  { value: "PUBLISHED", label: "PUBLISHED" },
  { value: "DRAFT", label: "DRAFT" },
]

const CreateCourse = ({ message, Tokens, GoogleId, dispatch }) => {
  const { courseId } = useParams();
  const [{ title, maxPoints, state }, setState] = useState(initialState);

  const clearState = () => {
    setState({ ...initialState });
  };

  const onChange = e => {
    const { name, value } = e.target;
    //console.log({[title]:value});
    console.log(value);

    //Set state from input value
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    //console.log(event);

    const courseWork = {
      title: title,
      maxPoints: maxPoints,
      workType: "ASSIGNMENT",
      state: state,
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
        JSON.stringify(courseWork),
        {
          headers: headers
        }
      )
      .then(response => {
        // handle success
        //console.log(response);
        clearState();
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () { });
    /**/
  };

  return (
    <div id="create-course">
      <h1>Create Assignment</h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <p>
          <Select
            labelId="demo-simple-select-label"
            name="state"
            onChange={ async e => {
              //console.log({[name]:value});
              await setState(prevState => ({ ...prevState, state: e.value }));
              console.log(state);
            }}
            options={stateAssignment}
          />
        </p>
        <p>
          <TextField
            name="title"
            value={title}
            onChange={onChange}
            style={{ width: "100%" }}
            label="Course title"
          />
        </p>
        <p>
          <TextField
            name="maxPoints"
            value={maxPoints}
            onChange={onChange}
            style={{ width: "100%" }}
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
