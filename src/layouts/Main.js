import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { Link, Redirect, Route } from "react-router-dom"
import clsx from "clsx";
import { makeStyles, useTheme, ThemeProvider } from "@material-ui/core/styles";
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
import PlusOne from "@material-ui/icons/PlusOne";
import Home from "@material-ui/icons/Home";
import Person from "@material-ui/icons/Person";
import InsertInvitation from "@material-ui/icons/InsertInvitation";
import brown from '@material-ui/core/colors/brown';
import { storeToken, storeGoogleId, storePermissions } from "../reducers/actions";
import googleMapState from "../map-state/google-map-state";
import { MenuList, MenuItem } from '@material-ui/core';
import Axios from 'axios'
import { render } from '@testing-library/react';


// Line Frontend Framework Init
const liff = window.liff;

//ความกว้างเมนู
const drawerWidth = 240;


const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        backgroundColor: brown
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

//Key menu
const navbar = ["/", "/create-course", "/invitation", "/profile"];
const icons = [<Home />, <PlusOne />, <InsertInvitation />, <Person />];

const Main = ({ component: Component, message, Tokens, dispatch, ...rest }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme} >
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    colorSecondary
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
                        {["Home", "Create Course", "Invitation", "Profile"].map((text, index) => {
                            return (
                                <ListItem button key={text} to={navbar[index]} component={Link}>
                                    <ListItemIcon>
                                        {icons[index]}
                                    </ListItemIcon>
                                    <ListItemText style={{ display: 'inline' }} primary={text} />
                                </ListItem>
                            );
                        })}
                    </List>
                    <Divider />
                    <MenuList>
                        <MenuItem onClick={(e) => {
                            Axios.post(`https://accounts.google.com/o/oauth2/revoke?token=${rest.token}`, '{}').then((res) => {
                                if (res.status === 200) {
                                    console.log('Logged out')
                                    dispatch(storeToken(""));
                                    dispatch(storePermissions(""));
                                    dispatch(storeGoogleId(""));
                                }
                            })
                        }} component="a">
                            Logout
                            </MenuItem>
                    </MenuList>
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
                            maxWidth: "90%",
                            textAlign: "center"
                        }}
                    >
                        {rest.children}
                    </div>
                </main>
            </div>
        </ThemeProvider >
    )

}

const AppWithConnect = connect(googleMapState)(Main);
export default AppWithConnect;
