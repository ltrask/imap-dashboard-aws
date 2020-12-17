import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import {Link} from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        // textAlign: "left"
        height: "100%"
    },
    title: {
        fontSize: 14,
    },
    cardBody: {
        marginTop: 12
    },
    cardActions: {
        justifyContent: 'center',
    }
});

export default function OutlinedCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                {props.titleHeader &&
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {props.titleHeader}
                </Typography>
                }
                <Typography variant="h5" component="h2">
                    {props.title}
                </Typography>
                {props.titleFooter &&
                <Typography color="textSecondary">
                    {props.titleFooter}
                </Typography>
                }
                <Typography className={classes.cardBody} variant="body2" component="p">
                    {props.description}
                </Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <Button size="small"
                        component={Link}
                        to={props.routeTo}
                        disabled={props.disableButton || false}>
                    {props.buttonIcon &&
                    <Icon color="secondary" style={{marginRight: "10px"}}>{props.buttonIcon}</Icon>
                    }
                    {props.buttonText}
                </Button>

            </CardActions>
        </Card>
    );
}