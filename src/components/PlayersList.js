import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import firebase from '../firebase';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

// Icons
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';

const useStyles = makeStyles((theme) => ({
    paper: {
        maxWidth: 700,
        margin: 'auto',
        width: '100%',
        backgroundColor: 'var(--secondary-background)',
        padding: 20,
        marginBottom: 20,
    },
    flex: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    header: {
        paddingTop: 40,
        paddingBottom: 40,
        color: 'var(--text-color)',
        textAlign: 'center',
        fontWeight: 600,
    },
    subtitle: {
        color: 'var(--text-color)',
        textAlign: 'center',
        marginBottom: 10,
    },
    listText: {
        color: 'var(--text-color)',
    },
    listTextInner: {
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

function PlayersList(props) {
    const classes = useStyles();
    const { game } = props;
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const db = firebase.firestore();
        db.collection('games').doc(game.id).collection('players').onSnapshot((querySnapshot) => {
            let newPlayers = [];
            querySnapshot.forEach((doc) => newPlayers.push(doc));
            setPlayers(newPlayers);
        });
    }, [game.id]);

    const formatNumber = (x) => {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
    }

    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" className={classes.subtitle}>Spillere</Typography>
            <List>
                {players.map((player) => {
                    return (
                        <ListItem button key={player.data().uid} >
                            <ListItemAvatar>
                                <Avatar className={classes.primary}>
                                    <PersonRoundedIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText className={classes.listText} primary={<div className={classes.listTextInner}><div>{player.data().name}</div><div>{formatNumber(player.data().money)} kr</div></div>} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
}

PlayersList.propTypes = {
    game: PropTypes.object.isRequired,
};

export default PlayersList;