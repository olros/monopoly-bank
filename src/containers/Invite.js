import React, { useState, useEffect } from 'react';
import URLS from '../URLS';
import { useParams, useHistory } from 'react-router-dom';
import firebase from '../firebase';

// Material UI Components
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

// Icons
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
    root: {
        padding: 20,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
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
    button: {
        height: 50,  
        marginBottom: 16,
    },
});

function Invite(props) {
    const classes = useStyles();
    let { id } = useParams();
    let history = useHistory();
    const [invite, setInvite] = useState(null);
    const [game, setGame] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const db = firebase.firestore();
        db.collection('invites').doc(id).get()
            .then(doc => setInvite(doc))
            .catch(error => showSnackbar(error.code + " - " + error.message));
      }, [id]);

    useEffect(() => {
        if (invite !== null) {
            const db = firebase.firestore();
            db.collection('games').doc(invite.data().gameId).get()
                .then(doc => setGame(doc))
                .catch(error => showSnackbar(error.code + " - " + error.message));
        }
      }, [invite]);

    const acceptInvite = () => {
        const db = firebase.firestore();
        db.collection("games").doc(invite.data().gameId).update({
            players: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
        });
        db.collection("games").doc(invite.data().gameId).collection('players').doc(firebase.auth().currentUser.uid).set({
            uid: firebase.auth().currentUser.uid,
            name: firebase.auth().currentUser.displayName,
            money: game.data().initialMoney,
        })
        .then(() => {
            showSnackbar("Invitasjonen har blitt godtatt")
            history.push(URLS.landing);
        });
        firebase.analytics().logEvent('invite', {
            accepted: true
        });
    }
    const declineInvite = () => {
        firebase.analytics().logEvent('invite', {
            accepted: false
        });
        history.push(URLS.landing);
    }

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    }

    return (
        <div className={classes.root}>
            {invite !== null && game !== null &&
                <React.Fragment>
                    <Paper elevation={3} className={classes.paper} >
                        <Typography variant="h1" className={classes.header}>{game.data().name}</Typography>
                        <Typography variant="subtitle1" className={classes.subtitle}>Du har blitt invitert til dette spillet</Typography>
                        <Typography variant="subtitle1" className={classes.subtitle}>OBS: Hvis du allerede er med, vil pengene dine bli tilbakestilt til startsummen</Typography>
                        <div className={classes.flex}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => acceptInvite()}
                                >
                                Godta invitasjon
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                className={classes.button}
                                onClick={() => declineInvite()}
                                >
                                Avslå invitasjon
                            </Button>
                        </div>
                    </Paper>
                </React.Fragment>
            }
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                action={<IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}><CloseIcon fontSize="small" /></IconButton>}
            />
        </div>
    );
}

export default Invite;
