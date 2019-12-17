import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";


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

    //console.log(name)
  }

  handleSubmit = event => {
    event.preventDefault();

    const classroom = {
      name: this.state.name,
      section: this.state.section,
      title: this.state.title,
    }
  }
  render() {
    return (
      <div>
        <h1>Update Course</h1>
        <form autoComplete="off">
          <p>
            <TextField id="name" onChange={this.handleChange} style={{ width: "80%" }} label="Course name" />
          </p>
          <p>
            <TextField id="section" style={{ width: "80%" }} label="Room" />
          </p>
          <p>
            <TextField id="title" style={{ width: "80%" }} label="Title" />
          </p>
          <p>
            <Button variant="contained" color="primary">
              Create course.
            </Button>
          </p>
        </form>

      </div>
    )
  }
}


export default CreateCourse