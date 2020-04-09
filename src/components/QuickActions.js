import React from 'react';
import PropTypes from 'prop-types';
import firebase from '../firebase';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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

function QuickActions(props) {
    const classes = useStyles();
    const { game, showSnackbar } = props;

    const passStart = () => {
        const db = firebase.firestore();
        db.collection('games').doc(game.id).collection('transactions').add({
            amount: game.data().passStartMoney,
            from: '--',
            fromName: 'Banken',
            to: firebase.auth().currentUser.uid,
            toName: firebase.auth().currentUser.displayName,
            time: new Date().getTime(),
        }).then(() => {
            var batch = db.batch();
            let toDoc = db.collection('games').doc(game.id).collection('players').doc(firebase.auth().currentUser.uid);
            batch.update(toDoc, {money: firebase.firestore.FieldValue.increment(game.data().passStartMoney)});
            batch.commit().then(() => showSnackbar("Du har passert start"));
        }).catch((error) => showSnackbar(error.code + " - " + error.message));
    }

    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" className={classes.subtitle}>Hurtighandlinger</Typography>
            <div className={classes.flex}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => passStart()}
                    >
                    Passer start
                </Button>
            </div>
        </Paper>
    );
}

QuickActions.propTypes = {
    showSnackbar: PropTypes.func.isRequired,
    game: PropTypes.object.isRequired,
};

export default QuickActions;