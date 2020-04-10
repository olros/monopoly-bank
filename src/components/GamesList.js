import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import URLS from '../URLS';
import { useHistory } from 'react-router-dom';

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
import SportsEsportsRoundedIcon from '@material-ui/icons/SportsEsportsRounded';

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
    list: {
        maxHeight: 600,
        position: 'relative',
        overflow: 'auto',
    },
    listText: {
        color: 'var(--text-color)',
    },
}));

function GamesList(props) {
    const classes = useStyles();
    const [games, setGames] = useState([]);
    let history = useHistory();

    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection('games').where("players", "array-contains", firebase.auth().currentUser.uid)
          .onSnapshot(snapshot => {
            if (snapshot.size) {
                let userGames = [];
                snapshot.forEach((doc) => {
                    userGames.push(doc);
                });
                setGames(userGames);
            }
          })
      return () => {
          unsubscribe()
        }
      }, [])

    const openGame = (id) => {
        history.push(URLS.game.concat(id).concat('/'));
    }

    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" className={classes.subtitle}>Mine spill</Typography>
            <List className={classes.list}>
                {games.map((game) => {
                    return (
                        <ListItem button key={game.id} onClick={() => openGame(game.id)} >
                            <ListItemAvatar>
                                <Avatar className={classes.primary}>
                                    <SportsEsportsRoundedIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText className={classes.listText} primary={game.data().name + " (" + game.data().players.length + " spillere)"} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
}

export default GamesList;