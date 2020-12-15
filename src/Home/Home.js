import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from "@material-ui/core/Paper";
import {makeStyles, MuiThemeProvider, useTheme} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import InfoOutlinedIcon from '@material-ui/icons/Info';
import ContactMailOutlinedIcon from '@material-ui/icons/ContactMail';
import OutlineCard from "./OutlineCard";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: "calc(100% - 84px)"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    card: {
        border: '1px solid grey',
        borderRadius: '5px',
        height: '150px'
    },
    toolDescription: {
        padding: "50px 150px"
    },
    mainCard: {
        margin: "10px 50px",
        height: '100%',
        minWidth: "1140px"
    },
    buttonBar: {
        // position: "absolute",
        // bottom: 0,
        justifyContent: "center"
    }
}));


export default function Home(props) {
    const theme = useTheme();

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <MuiThemeProvider theme={theme}>
            <Grid container spacing={2} style={{height: "100%"}}>
                <Grid item xs={12} style={{height: "100%"}}>
                    <Paper className={classes.mainCard}>
                        <div style={{height: "calc(100% - 50px)"}}>
                            <Typography variant="h3">Welcome to the IMAP Dashboard and Analysis Tool!</Typography>
                            <Grid container spacing={4} style={{padding: '50px 150px 5px 150px'}}>
                                <Grid item xs={4}>
                                    <OutlineCard
                                        title="IMAP Network Map"
                                        titleHeader={null}
                                        titleFooter={null}
                                        description="View existing NCDOT IMAP routes and performance."
                                        buttonAction={function () {props.displayStageFunc(1)}}
                                        buttonText="View Network"
                                        buttonIcon="map"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <OutlineCard
                                        title="Priority Sensitivity Analysis"
                                        titleHeader={null}
                                        titleFooter={null}
                                        description="Explore the effects of the five weighting factors on the priority scores of the NCDOT network."
                                        buttonAction={function () {props.displayStageFunc(2)}}
                                        buttonText="Explore Sensitivity"
                                        buttonIcon="dashboard"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <OutlineCard
                                        title="IMAP Routing and Analysis"
                                        titleHeader={null}
                                        titleFooter="Under Development"
                                        description="Conduct a benefit-cost analysis on an existing or
                                                proposed IMAP route."
                                        buttonAction={function () {props.displayStageFunc(3)}}
                                        buttonText="Launch Assessment"
                                        buttonIcon="assessment"
                                        disableButton={true}
                                    />
                                </Grid>
                            </Grid>
                            <Typography className={classes.toolDescription} variant="body2">
                                This will ultimately end up being the description of the tool.  The purpose of the tool is
                                to help NCDOT and it's contractors understand and assess the agency's IMAP Truck deployments.
                                The IMAP road network can be viewed, and prioritization of segments can be explored using a
                                sensitivity analysis tool.
                            </Typography>
                        </div>
                        <div style={{height: "50px"}}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <div className={classes.buttonBar}>
                                        <Button color="primary" style={{margin: "10px"}} onClick={function () {props.displayStageFunc(4)}}><ContactMailOutlinedIcon style={{marginRight: "10px"}}/>About</Button>
                                        <Button color="primary" style={{margin: "10px"}} onClick={function () {props.displayStageFunc(5)}}><InfoOutlinedIcon style={{marginRight: "10px"}}/>Contact</Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
            </MuiThemeProvider>
        </div>
    )
}