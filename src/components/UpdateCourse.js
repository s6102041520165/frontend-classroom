import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";


class UpdateCourse extends Component {
    render() {
        return (
            <div>
                <h1>Create Course</h1>
                <form autoComplete="off">
                    <p>
                        <TextField id="name" style={{ width: "80%" }} label="Course name" />
                    </p>
                    <p>
                        <TextField id="room" style={{ width: "80%" }} label="Room" />
                    </p>
                    <p>
                        <TextField id="title" style={{ width: "80%" }} label="Title" />
                    </p>
                    <p>
                        <Button variant="contained" color="primary">
                            Update course.
                        </Button>
                    </p>
                </form>

            </div>
        )
    }
}

export default UpdateCourse