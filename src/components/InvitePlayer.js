import React, { useState } from 'react';
import PropTypes from 'prop-types';
import firebase from '../firebase';
import URLS from '../URLS';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Components
import ShareDialog from './ShareDialog';

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
    button: {
        height: 50,  
        marginBottom: 16,
    },
}));

function InvitePlayer(props) {
    const classes = useStyles();
    const { gameId, showSnackbar } = props;
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [inviteUrl, setInviteUrl] = useState('');

    const formSubmit = async (e) => {
        e.preventDefault();
        const db = firebase.firestore();
        db.collection('invites').add({
                gameId: gameId,
            })
            .then((invite) => {
                setInviteUrl(window.location.origin.concat(URLS.invite).concat(invite.id).concat('/'));
                showSnackbar("Invitasjonen har blitt opprettet");
                setShareDialogOpen(true);
            });
    }

    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" className={classes.subtitle}>Inviter spillere</Typography>
            <form className={classes.flex} autoComplete="off" onSubmit={formSubmit}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    type='submit'
                    >
                    Inviter spiller
                </Button>
            </form>
            <ShareDialog url={inviteUrl} open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} showSnackbar={showSnackbar} />
        </Paper>
    );
}

InvitePlayer.propTypes = {
    showSnackbar: PropTypes.func.isRequired,
    gameId: PropTypes.string.isRequired,
};

export default InvitePlayer;