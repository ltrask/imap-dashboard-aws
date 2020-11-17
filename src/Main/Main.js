import React from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssessmentIcon from '@material-ui/icons/Assessment';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MapIcon from '@material-ui/icons/Map';
import InfoIcon from '@material-ui/icons/Info';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import CenterComponent from "./CenterComponent";
import {Auth} from "aws-amplify";
import {AccountCircle, FreeBreakfastTwoTone} from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

// Adapted from the persistent drawer example here: https://material-ui.com/components/drawers/

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex'
    },
    title: {
        flexGrow: 1
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(0, 1),
    },
}));

async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

export default function Main() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [displayStage, setDisplayStage] = React.useState(2);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleExploreClick = () => {
        setDisplayStage(0);
    }

    const handleCorridorClick = () => {
        setDisplayStage(1);
    }

    const handleSegmentClick = () => {
        setDisplayStage(2);
    }

    const handleAboutClick = () => {
        setDisplayStage(3);
    }

    const handleContactClick = () => {
        setDisplayStage(4);
    }

    const handleDevClick = () => {
        setDisplayStage(5);
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        signOut().then(r => handleClose());
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title} noWrap>
                        NCDOT IMAP Dashboard
                    </Typography>
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={menuOpen}
                            onClose={handleClose}
                        >
                            {/*<MenuItem onClick={handleClose} >Profile</MenuItem>*/}
                            <MenuItem onClick={handleClose} disabled>My account</MenuItem>
                            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    <ListItem button key={'Map View'} onClick={handleExploreClick} title={"View Fullscreen Map"}
                              selected={displayStage === 0}>
                        <ListItemIcon><MapIcon/></ListItemIcon>
                        <ListItemText primary={'Map View'}/>
                    </ListItem>
                    <ListItem button key={'Dashboard View #1'} onClick={handleCorridorClick}
                              title={"Dashboard View #1"} selected={displayStage === 1}>
                        <ListItemIcon><DashboardIcon/></ListItemIcon>
                        <ListItemText primary={'Dashboard View #1'}/>
                    </ListItem>
                    <ListItem button key={'Dashboard View #2'} onClick={handleSegmentClick}
                              title={"'Dashboard View #2'"}
                              selected={displayStage === 2}>
                        <ListItemIcon><AssessmentIcon/></ListItemIcon>
                        <ListItemText primary={'Dashboard View #2'}/>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    <ListItem button key={'About'} onClick={handleAboutClick} title={"About & Additional Info"}
                              selected={displayStage === 3}>
                        <ListItemIcon><InfoIcon/></ListItemIcon>
                        <ListItemText primary={'About'}/>
                    </ListItem>
                    <ListItem button key={'Contact'} onClick={handleContactClick} title={"Contact Information"}
                              selected={displayStage === 4}>
                        <ListItemIcon><ContactMailIcon/></ListItemIcon>
                        <ListItemText primary={'Contact'}/>
                    </ListItem>
                    <ListItem button key={'Dev'} onClick={handleDevClick} title={"Development Component"}
                              selected={displayStage === 5}>
                        <ListItemIcon><FreeBreakfastTwoTone/></ListItemIcon>
                        <ListItemText primary={'Development'}/>
                    </ListItem>
                </List>
            </Drawer>

            <main className={classes.content} style={{height: "100vh"}}>  {/* IMPORTANT: 100vh makes it full height!*/}
                <div className={classes.toolbar}/>
                <CenterComponent displayStage={displayStage}/>
            </main>
        </div>
    );
}