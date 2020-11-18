import React from "react";
import Paper from "@material-ui/core/Paper";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import LanguageIcon from "@material-ui/icons/Language"
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Link from '@material-ui/core/Link';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import '../App.css';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
    },
    paper: {
        maxWidth: 400,
        minWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },

}));

export function ContactCard(props) {
    const classes = useStyles();

    let names = props.name.split(' ');
    let initials = names[0][0].toUpperCase();
    if (names.length === 2) {
        initials = initials + names[1][0].toUpperCase();
    }

    const preventDefault = (event) => event.preventDefault();

    return (
        <Paper className={classes.paper}>
            <List dense={true}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={{margin: "auto"}}>{initials}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={props.name}
                        secondary={props.title || null}
                    />
                </ListItem>
                {props.email &&
                <ListItem>
                    <ListItemIcon>
                        <EmailIcon style={{margin: "auto"}}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={props.email}
                    />
                </ListItem>
                }
                {props.phone &&
                <ListItem>
                    <ListItemIcon>
                        <PhoneIcon style={{margin: "auto"}}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={props.phone}
                    />
                </ListItem>
                }
                {props.website &&
                <ListItem>
                    <ListItemIcon>
                        <LanguageIcon style={{margin: "auto"}}/>
                    </ListItemIcon>
                    <Link href={props.website} target="_blank" onClick={preventDefault}>
                        Kittelson Homepage
                    </Link>
                </ListItem>
                }
            </List>
        </Paper>
    );
}

export default function Contacts(props) {
    return (
        <div className="center-content">
            <ContactCard
                name="Lake Trask"
                title="Data Scientist/Developer"
                email="ltrask@kittelson.com"
                phone="910.399.5081"
                website="https://www.kittelson.com/people/lake-trask/"
            />
            <ContactCard
                name="Michael Anderson"
                title="Data Analyst/Programmer"
                email="manderson@kittelson.com"
                phone="910.769.9005"
                website="https://www.kittelson.com/people/michael-anderson/"
            />
        </div>
    );
}