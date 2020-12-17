import React from 'react';
import PropTypes from 'prop-types';
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
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapIcon from '@material-ui/icons/Map';
import InfoIcon from '@material-ui/icons/Info';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import AssessmentIcon from '@material-ui/icons/Assessment';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import {Auth} from "aws-amplify";
import {AccountCircle, FreeBreakfastTwoTone} from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {isInGroup} from "../shared/amplifyUtils/Utils";
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch
} from "react-router-dom"
import Home from "../Home/Home";
import ExistingRoutesMap from "../ExistingRoutesMap/ExistingRoutesMap";
import Contacts from "../Contacts/Contacts";
import NCSensitivityMap from "../Map/NCSensitivityMap";
import UnderConstructionCard from "../shared/HelperComponents/UnderConstructionCard";

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

function ListItemLink(props) {
    const { disabled, icon, primary, title, to } = props;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <Link to={to} ref={ref} {...itemProps} />),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink} title={title} disabled={disabled}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}

ListItemLink.propTypes = {
    disabled: PropTypes.bool,
    icon: PropTypes.element,
    primary: PropTypes.string.isRequired,
    title: PropTypes.string,
    to: PropTypes.string.isRequired,
};

export default function Main(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        signOut().then(r => handleClose());
    }

    let emailStr = "";
    if (props && props.user) {
        emailStr = props.user.signInUserSession.idToken.payload["email"];
        if (isInGroup(props.user, "Admin")) {
            emailStr += " (Admin)";
        } else if (isInGroup(props.user, "NCDOT")) {
            emailStr += " (NCDOT)";
        }
    }

    return (
        <Router>
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
                    <Typography variant="body2">
                        {emailStr}
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
                    <ListItemLink
                        to="/"
                        primary="Home"
                        icon={<HomeIcon/>}
                        title={"NCDOT IMAP Dashboard and Analysis Tool Home Screen"}
                    />
                    <ListItemLink
                        to="/existing-routes"
                        primary='Map View'
                        icon={<MapIcon/>}
                        title={"View Fullscreen Map"}
                    />
                    <ListItemLink
                        to="/sensitivity-analysis"
                        primary='Priority Sensitivity'
                        icon={<AssessmentIcon/>}
                        title={"Sensitivity Analysis Tool for the Priority Scoring Metric"}
                    />
                    <ListItemLink
                        to="/benefit-cost"
                        primary='Benefit-Cost'
                        icon={<MonetizationOnIcon/>}
                        title={"Benefit-Cost Assessment Tool"}
                        disabled
                    />
                    <ListItemLink
                        to="/imap-routing"
                        primary='IMAP Routing'
                        icon={<EditLocationIcon/>}
                        title={"IMAP Route Selection and Analysis Tool"}
                        disabled
                    />
                </List>
                <Divider/>
                <List>
                    <ListItemLink
                        to="/about"
                        primary='About'
                        icon={<InfoIcon/>}
                        title={"About & Additional Info"}
                    />
                    <ListItemLink
                        to="/contact"
                        primary='Contact'
                        icon={<ContactMailIcon/>}
                        title={"Contact Information"}
                    />
                    <ListItemLink
                        to="/coming-soon"
                        primary="Coming Soon"
                        icon={<FreeBreakfastTwoTone/>}
                    />
                </List>
            </Drawer>

            <main className={classes.content} style={{height: "100vh"}}>  {/* IMPORTANT: 100vh makes it full height!*/}
                <div className={classes.toolbar}/>
                {/*<CenterComponent displayStage={displayStage} displayStageFunc={setDisplayStage}/>*/}
                <div style={{height: "calc(100% - 84px)"}}>
                    <Switch>
                        <Route exact path="/">
                            <Home/>
                        </Route>
                        <Route path="/existing-routes">
                            <ExistingRoutesMap/>
                        </Route>
                        <Route path="/sensitivity-analysis">
                            <NCSensitivityMap/>
                        </Route>
                        <Route path="/benefit-cost">
                            <div>Benefit-Cost</div>
                        </Route>
                        <Route path="/imap-routing">
                            <div>IMAP Routing</div>
                        </Route>
                        <Route path="/about">
                            <div>About</div>
                        </Route>
                        <Route path="/contact">
                            <Contacts />
                        </Route>
                        <Route path="/coming-soon">
                            <UnderConstructionCard />
                        </Route>
                    </Switch>
                </div>
            </main>
        </div>
        </Router>
    );
}