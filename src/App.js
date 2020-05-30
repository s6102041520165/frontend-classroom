//Import modules
import { Route, Router, Redirect, Switch } from "react-router-dom";
import React from "react";
import { connect } from "react-redux";
import PageNotFound from "./pages/PageNotFound";
import Layout from "./layouts/Main";

//Import screens
import CreateCourse from "./components/CreateCourse";
import CreateCourseWork from "./components/CreateCourseWork";
import CreateTopic from "./components/CreateTopic";
import UpdateCourse from "./components/UpdateCourse";
import invitation from "./components/invitation";
import courses from "./components/Courses";
import profile from "./components/profile";
import student from "./components/students";

import PrivateRoute from "./components/PrivateRoute";
import googleMapState from "./map-state/google-map-state";
import Login from "./components/GoogleAuth";
import getCourse from "./components/Course";
import Upload from "./components/Upload";
import Authorization from "./components/Authorization";
import redirect from "./components/redirect";
import { storeToken, storeGoogleId, storePermissions } from "./reducers/actions";


function App({ message, Tokens, dispatch, props }) {
  return (
    <Layout token={Tokens}>
      <Switch>
        <PrivateRoute exact path="/" component={courses} />
        <PrivateRoute path="/create-course" component={CreateCourse} />
        <PrivateRoute path="/create-assignment/:courseId" component={CreateCourseWork} />
        <PrivateRoute path="/create-topic/:courseId" component={CreateTopic} />
        <PrivateRoute path="/update-course" component={UpdateCourse} />
        <PrivateRoute path="/invitation" component={invitation} />
        <PrivateRoute path="/student" component={student} />
        <PrivateRoute path="/courses" component={courses} />
        <PrivateRoute path="/course-work/:courseId/details/:id" component={Upload} />
        <PrivateRoute path="/course/:id" component={getCourse} />
        <Authorization path="/logged" component={redirect} />
        <Authorization path="/login" component={Login} />
        <PrivateRoute path="/profile" component={profile} />
        <Route path="/page-not-found" component={PageNotFound} />
        <Redirect to="/page-not-found" />
      </Switch>
    </Layout>
  );
}   

const AppWithConnect = connect(googleMapState)(App);
export default AppWithConnect;
