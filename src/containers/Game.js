import React, { useState, useEffect } from 'react';
import URLS from '../URLS';
import { useHistory, useParams } from 'react-router-dom';
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

// Components
import InvitePlayer from '../components/InvitePlayer';
import PlayersList from '../components/PlayersList';
import NewTransaction from '../components/NewTransaction';
import BankTransaction from '../components/BankTransaction';
import TransactionsTable from '../components/TransactionsTable';
import QuickActions from '../components/QuickActions';

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
        paddingBottom: 20,
        color: 'var(--text-color)',
        textAlign: 'center',
        fontWeight: 600,
    },
    subtitle: {
        color: 'var(--text-color)',
        textAlign: 'center',
        marginBottom: 10,
    },
    center: {
        margin: 'auto',
    },
    button: {
        maxWidth: 700,
        margin: 'auto',
        width: '100%',
    },
});

function Game(props) {
    const classes = useStyles();
    let { id } = useParams();
    let history = useHistory();
    const [game, setGame] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection('games').doc(id).onSnapshot(doc => setGame(doc));
        return () => {
            unsubscribe()
        }
    }, [id]);

    const formatNumber = (x) => {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
    }

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    }

    return (
        <div className={classes.root}>
            {game !== null && game.data() !== undefined &&
                <React.Fragment>
                    <Paper elevation={3} className={classes.paper} >
                        <Typography variant="h2" className={classes.header}>{game.data().name}</Typography>
                        <Typography variant="subtitle1" className={classes.subtitle}>
                            Spillere: {game.data().players.length}<br/>
                            Startsum per spiller: {formatNumber(game.data().initialMoney)} kr<br/>
                            Sum ved passering start: {formatNumber(game.data().passStartMoney)} kr
                        </Typography>
                    </Paper>
                    <PlayersList game={game} />
                    <NewTransaction game={game} showSnackbar={showSnackbar} />
                    <BankTransaction game={game} showSnackbar={showSnackbar} />
                    <TransactionsTable game={game} />
                    <QuickActions game={game} showSnackbar={showSnackbar} />
                    <InvitePlayer gameId={id} showSnackbar={showSnackbar} />
                </React.Fragment>
            }
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={() => history.push(URLS.landing)}
                >
                Forsiden
            </Button>
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

export default Game;
