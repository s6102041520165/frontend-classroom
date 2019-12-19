import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Axios from "axios";
import { GoogleLogin } from "react-google-login";

class CreateCourse extends Component {
  state = {
    name: "",
    section: "",
    title: ""
  };

  responseGoogle = response => {
    console.log(response);
  };

  //Form name
  handleChangeName = event => {
    this.setState({
      name: event.target.value
    });
  };

  //Form section
  handleChangeSection = event => {
    this.setState({
      section: event.target.value
    });
  };

  //Form title
  handleChangeTitle = event => {
    this.setState({
      titile: event.target.value
    });
    console.log(event.target);
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log(event);

    const classroom = {
      name: this.state.name,
      section: this.state.section,
      title: this.state.title
    };
    //console.log(classroom)
    Axios.post(
      "https://lineappbackend.herokuapp.com/webhook/course/create/",
      classroom
    ).then(res => {
      console.log(res.data);
    });
  };
  render() {
    return (
      <div>
        <h1>Create Course</h1>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <p>
            <TextField
              id="name"
              value={this.state.name}
              onChange={this.handleChangeName.bind(this)}
              style={{ width: "80%" }}
              label="Course name"
            />
          </p>
          <p>
            <TextField
              id="section"
              value={this.state.section}
              onChange={this.handleChangeSection.bind(this)}
              style={{ width: "80%" }}
              label="Room"
            />
          </p>
          <p>
            <TextField
              id="title"
              value={this.state.title}
              onChange={this.handleChangeTitle.bind(this)}
              style={{ width: "80%" }}
              label="Title"
            />
          </p>
          <p>
            <Button type="submit" variant="contained" color="primary">
              Create course.
            </Button>

            <GoogleLogin
              clientId="308789454611-isrob12j0f3l23meqnl8959lvdfgdg67.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              cookiePolicy={"single_host_origin"}
              scope="https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.courses.readonly"
              redirectUri="http://localhost:3000/create-course"
            />
          </p>
        </form>
      </div>
    );
  }
}

export default CreateCourse;
