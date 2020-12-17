import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {IconButton} from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        minWidth: 275,
        maxWidth: 350,
        margin: "25px auto",
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function SimpleCard() {
    const classes = useStyles();

    return (
        <div>
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        <WarningRoundedIcon/>
                        Under Construction
                    </Typography>
                    <Typography variant="body2" component="p">
                        This feature of the NCDOT IMAP Dashboard is currently under construction. Check back at a later
                        time to see if the feature has been released!
                    </Typography>
                </CardContent>
                <CardActions>
                    <IconButton component={Link} to={"/"}><HomeIcon/></IconButton>
                    <IconButton component={Link} to={"/contact"}><ContactMailIcon/></IconButton>
                </CardActions>
            </Card>
        </div>
    );
}
