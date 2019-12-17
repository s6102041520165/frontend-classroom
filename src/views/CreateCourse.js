import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import request from "request";


class CreateCourse extends Component {
  state = {
    name: '',
    section: '',
    title: '',
  }

  handleChange = event => {
    this.setState({
      name: event.target.value,
      section: event.target.value,
      title: event.target.value,
    });

    //console.log(this.state.name)
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(event)

    const classroom = {
      name: this.state.name,
      section: this.state.section,
      title: this.state.title,
    }
    //console.log(classroom)
    request.post(
      {
        url: "https://lineappbackend.herokuapp.com/webhook/course/create-course/",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classroom)
      },
      (err, res, body) => {
        console.log("status = " + JSON.stringify(body));
      }
    );

  }
  render() {
    return (
      <div>
        <h1>Create Course</h1>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <p>
            <TextField id="name" onChange={this.handleChange} style={{ width: "80%" }} label="Course name" />
          </p>
          <p>
            <TextField id="section" onChange={this.handleChange} style={{ width: "80%" }} label="Room" />
          </p>
          <p>
            <TextField id="title" onChange={this.handleChange} style={{ width: "80%" }} label="Title" />
          </p>
          <p>
            <Button type="submit" variant="contained" color="primary">
              Create course.
            </Button>
          </p>
        </form>

      </div>
    )
  }
}


export default CreateCourse