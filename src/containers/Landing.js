import React, { useState, useEffect } from 'react';
import URLS from '../URLS';
import { Link } from 'react-router-dom';
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
import Auth from '../components/Auth';
import GamesList from '../components/GamesList';
import NewGame from '../components/NewGame';

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
    button: {
        maxWidth: 700,
        margin: 'auto',
        width: '100%',
    },
});

function Landing(props) {
    const classes = useStyles();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [auth, setAuth] = useState(null);

    // firebase.auth().onAuthStateChanged((user) => setAuth(user));
    useEffect(() =>{
        const unlisten = firebase.auth().onAuthStateChanged((user) => setAuth(user));
        return () => {
            unlisten();
        }
     }, []);

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    }

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={classes.paper} >
                <Link to={URLS.landing}><Typography variant="h1" className={classes.header}>Bank</Typography></Link>
                <Typography variant="subtitle1" className={classes.subtitle}>Velkommen til Bank!<br/>Bank er en online monopolbank.<br/>Lag et spill, inviter medspillere og spill!</Typography>
            </Paper>
            {auth ?
                <React.Fragment>
                    <GamesList />
                    <NewGame showSnackbar={showSnackbar} />
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={() => firebase.auth().signOut()}
                        >
                        Logg ut
                    </Button>
                </React.Fragment>

            :
                <Auth showSnackbar={showSnackbar} />
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

export default Landing;
