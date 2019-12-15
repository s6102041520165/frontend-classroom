import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import CreateCourse from "./views/CreateCourse";
import UpdateCourse from "./views/UpdateCourse";

class App extends Component {
  render() {
    return (
      <div className="App container">
        <Route path="/create-course" component={CreateCourse} />
        <Route path="/update-course" component={UpdateCourse} />
      </div>
    )
  }
}

export default App