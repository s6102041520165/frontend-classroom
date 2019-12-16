//Import module
import { Route } from 'react-router-dom'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import { Link } from "react-router-dom";



//Import screen
import CreateCourse from "./views/CreateCourse";
import UpdateCourse from "./views/UpdateCourse";
import Home from "./views/Home";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: '100%',
  },
  container: {
    maxWidth: 800,
    margin: 'auto',
  }
});

export default function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Paper square className={classes.root}>
        <Tabs
          className={classes.container}
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon tabs example"
        >
          <Tab tab={<Link to="/"/>} icon={<HomeIcon />} aria-label="Home" />
          <Tab tab={<Link to="/create-course"/>} icon={<FavoriteIcon />} aria-label="favorite" />
          <Tab icon={<PersonPinIcon />} aria-label="person" />
        </Tabs>

      </Paper>

      <div style={{ margin: 'auto', maxWidth: "800px", textAlign: 'center' }}>
        <Route path="/create-course" component={CreateCourse} />
        <Route path="/update-course" component={UpdateCourse} />
        <Route path="/" component={Home} />
      </div>
    </div>
  );
}