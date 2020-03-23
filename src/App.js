//Import modules
import { Route, Router } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";


//Import screens
import CreateCourse from "./components/CreateCourse";
import CreateCourseWork from "./components/CreateCourseWork";
import CreateTopic from "./components/CreateTopic";
import UpdateCourse from "./components/UpdateCourse";
import invitation from "./components/invitation";
import courses from "./components/Courses";

import PrivateRoute from "./components/PrivateRoute";
import googleMapState from "./map-state/google-map-state";
import Login from "./components/GoogleAuth";
import getCourse from "./components/Course";
import Upload from "./components/Upload";
import Authorization from "./components/Authorization";
import redirect from "./components/redirect";

// Line Frontend Framework Init
const liff = window.liff;

//ความกว้างเมนู
const drawerWidth = 240;

//Initial state
const initialState = {
  name: "",
  userLineId: "",
  statusMessage: ""
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
}));

const navbar = ["/", "/create-course", "/invitation"];

function App({ message, Tokens, dispatch, props }) {
  const [{ name, userLineId, statusMessage }, setState] = useState(
    initialState
  );
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!name) {
      getProfile();
    }
  }, []);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };



  const sendMessage = () => {
    liff
      .sendMessage([
        {
          type: "text",
          text: `Say Hi!`
        }
      ])
      .then(() => {
        liff.closeWindow();
      });
  };

  const getProfile = () => {
    liff.init(async () => {
      let getProfile = await liff.getProfile();
      setState({
        name: getProfile.displayName,
        userLineId: getProfile.userId,
        statusMessage: getProfile.statusMessage
      });
    });
  };

  const closeLIFF = () => {
    liff.closeWindow();
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Line Classroom
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
                <ChevronRightIcon />
              )}
          </IconButton>
        </div>

        <Divider />
        <List>
          {["Home", "Create Course", "Invitation"].map((text, index) => {
            return (
              <ListItem button key={text} to={navbar[index]} component={Link}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        <div className={classes.drawerHeader} />
        <div
          style={{
            margin: "auto",
            maxWidth: "80%",
            textAlign: "center"
          }}
        >

          {(name && name != '')
            ?
            <p>Name: {name}</p>
            :
            null
          }
          
          <PrivateRoute exact path="/" component={courses} />
          <PrivateRoute path="/create-course" component={CreateCourse} />
          <PrivateRoute path="/create-assignment/:courseId" component={CreateCourseWork} />
          <PrivateRoute path="/create-topic/:courseId" component={CreateTopic} />
          <PrivateRoute path="/update-course" component={UpdateCourse} />
          <PrivateRoute path="/invitation" component={invitation} />
          <PrivateRoute path="/student" component={invitation} />
          <PrivateRoute path="/courses" component={courses} />
          <PrivateRoute path="/course-work/:courseId/details/:id" component={Upload} />
          <PrivateRoute path="/course/:id" component={getCourse} />
          <Route path="/redirect/" component={redirect} />
          <Authorization path="/login" component={Login} />
          
        </div>
      </main>
    </div>
  );
}



const AppWithConnect = connect(googleMapState)(App);
export default AppWithConnect;
