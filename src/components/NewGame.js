import React, { useState } from 'react';
import PropTypes from 'prop-types';
import firebase from '../firebase';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
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
    input: {
        marginBottom: 16,
    },
    button: {
        height: 50,  
        marginBottom: 16,
    },
}));

function NewGame(props) {
    const classes = useStyles();
    const { showSnackbar } = props;
    const [name, setName] = useState('');
    const [initialMoney, setInitialMoney] = useState(0);
    const [passStartMoney, setPassStartMoney] = useState(0);

    const formSubmit = async (e) => {
        e.preventDefault();
        const db = firebase.firestore();
        db.collection('games').add({
                name: name,
                initialMoney: parseInt(initialMoney.replace(/^0+/, '')),
                passStartMoney: parseInt(passStartMoney.replace(/^0+/, '')),
                players: [firebase.auth().currentUser.uid],
            })
            .then((game) => {
                game.collection('players').doc(firebase.auth().currentUser.uid).set({
                    uid: firebase.auth().currentUser.uid,
                    name: firebase.auth().currentUser.displayName,
                    money: parseInt(initialMoney.replace(/^0+/, '')),
                })
                .then(() => {
                    showSnackbar(name + " har blitt opprettet")
                    setName('');
                    setInitialMoney(0);
                    setPassStartMoney(0);
                });
            });
        firebase.analytics().logEvent('create_game', {
            start_money: parseInt(initialMoney),
            pass_start_money: parseInt(passStartMoney)
        });
    }

    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" className={classes.subtitle}>Opprett nytt spill</Typography>
            <form className={classes.flex} autoComplete="off" onSubmit={formSubmit}>
                <TextField onChange={(e) => setName(e.target.value)} value={name} className={classes.input} label="Navn på spill" variant="outlined" required />
                <TextField type="number" onChange={(e) => setInitialMoney(e.target.value)} value={initialMoney} className={classes.input} label="Startsum i banken per spiller" variant="outlined" required />
                <TextField type="number" onChange={(e) => setPassStartMoney(e.target.value)} value={passStartMoney} className={classes.input} label="Sum ved passering av start" variant="outlined" required />
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    type='submit'
                    >
                    Opprett nytt spill
                </Button>
            </form>
        </Paper>
    );
}

NewGame.propTypes = {
    showSnackbar: PropTypes.func.isRequired,
};

export default NewGame;