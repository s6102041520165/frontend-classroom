import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { connect } from "react-redux";
import googleMapState from "../map-state/google-map-state";
import { Redirect } from "react-router-dom";

const initialState = {
  name: "",
  section: "",
  room: "",
  googleId: ""
};

const CreateCourse = ({ message, Permissions , Tokens, GoogleId, dispatch }) => {
  const [{ name, section, room }, setState] = useState(initialState);
  const [checkPermission, setPermission] = useState(false);

  const clearState = () => {
    setState({ ...initialState });
  };

  useEffect(() => {
    if(Permissions){
      for (let index = 0; index < Permissions.length; index++) {
        if((Permissions[0].permission) == "CREATE_COURSE"){
          setPermission(true);
          continue;
        }    
      }
    } 
    if(checkPermission == true){
      return <Redirect go="-1"/>
    }
  },[]);

  const onChange = e => {
    const { name, value } = e.target;
    //console.log({[name]:value});

    //Set state from input value
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    //console.log(event);

    const classroom = {
      name: name,
      section: section,
      room: room,
      googleId: GoogleId
    };

    //console.log(classroom);
    let headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Tokens}`
    };
    /** */
    axios
      .post(
        "https://lineappbackend.herokuapp.com/webhook/course/create",
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

      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {

      });
  };

  return (
    <div id="create-course">
      <h1>Create Course</h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <p>
          <TextField
            name="name"
            value={name}
            onChange={onChange}
            style={{ width: "80%" }}
            label="Course name"
          />
        </p>
        <p>
          <TextField
            name="section"
            value={section}
            onChange={onChange}
            style={{ width: "80%" }}
            label="Section"
          />
        </p>
        <p>
          <TextField
            name="room"
            value={room}
            onChange={onChange}
            style={{ width: "80%" }}
            label="Room"
          />
        </p>
        <p>
          <Button type="submit" variant="contained" color="primary">
            Create course.
          </Button>
        </p>
      </form>
    </div>
  );
};

const AppWithConnect = connect(googleMapState)(CreateCourse);
export default AppWithConnect;
