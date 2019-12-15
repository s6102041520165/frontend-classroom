import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import CreateCourse from "./views/CreateCourse";
import UpdateCourse from "./views/UpdateCourse";
import { width } from 'dom-helpers';

class App extends Component {
  render() {
    return (
      <div style={{margin:'auto',maxWidth:"800px",textAlign:'center'}}>
        <Route path="/create-course" component={CreateCourse} />
        <Route path="/update-course" component={UpdateCourse} />
      </div>
    )
  }
}

export default App