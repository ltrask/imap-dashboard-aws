import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import {kaiTheme} from "./style/kaiTheme";
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifySignOut} from '@aws-amplify/ui-react';
import {AuthState, onAuthUIStateChange} from '@aws-amplify/ui-components';
import AppBar from "@material-ui/core/AppBar";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {AccountCircle} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

// https://connect.ncdot.gov/resources/gis/cartographic-standards/Pages/CSG.aspx
const theme = createMuiTheme({
    palette: {
        // primary: {
        //     main: '#344955',
        //     dark: '#232f34',
        //     light: '#4A6572'
        // },
        primary: {
            main: kaiTheme.ncdot_blue,
            dark: '#232f34',
            light: '#4A6572'
        },
        secondary: {
            main: kaiTheme.kai_color_orange_pms,
            dark: kaiTheme.kai_color_orange,
            light: kaiTheme.kai_color_yellow_bright,
        }
    }
})

const AuthStateApp = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const classes = useStyles();

    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

    return authState === AuthState.SignedIn && user ? (
        <div className="App">
            <MuiThemeProvider theme={theme}>
                {/*<Main/>*/}
                Signed in!
                <AmplifySignOut/>
            </MuiThemeProvider>
        </div>
    ) : (
        <div className="App">
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" className={classes.title}>
                                NCDOT IMAP Dashboard
                            </Typography>
                            <div>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                    // disabled={true}
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
                                    <MenuItem onClick={null} disabled>My Account</MenuItem>
                                    <MenuItem onClick={null} disabled>Sign Out</MenuItem>
                                </Menu>
                            </div>
                        </Toolbar>
                    </AppBar>
                </div>
            </MuiThemeProvider>
            <div className="grey">
                <div className="center-div">
                    <AmplifyAuthenticator usernameAlias="email">
                        <AmplifySignUp
                            slot="sign-up"
                            usernameAlias="email"
                            formFields={[
                                {
                                    type: "email",
                                    label: "New Account Email Address",
                                    // placeholder: "Enter email address",
                                    required: true,
                                },
                                {
                                    type: "password",
                                    label: "New Account Password",
                                    // placeholder: "custom password placeholder",
                                    required: true,
                                },
                            ]}
                        />
                        <AmplifySignIn slot="sign-in" usernameAlias="email"/>
                    </AmplifyAuthenticator>
                </div>
            </div>

        </div>
    );
}

export default AuthStateApp;