import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { CreateCourse } from "./views/CreateCourse";
const updateCourse = () => <h1>About</h1>

class App extends Component {
  render() {
    return (
      <div className="App container">
        <Route path="/create-course" component={CreateCourse} />
        <Route path="/update-course" component={updateCourse} />
      </div>
    )
  }
}

export default App