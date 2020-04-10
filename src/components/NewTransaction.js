import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import firebase from '../firebase';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

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
    formControl: {
        marginBottom: 16,
    },
}));

function NewTransaction(props) {
    const classes = useStyles();
    const { showSnackbar, game } = props;
    const [players, setPlayers] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [fromName, setFromName] = useState('');
    const [toName, setToName] = useState('');
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const db = firebase.firestore();
        db.collection('games').doc(game.id).collection('players').onSnapshot((querySnapshot) => {
            let newPlayers = [];
            querySnapshot.forEach((doc) => newPlayers.push(doc));
            setPlayers(newPlayers);
            setFrom(newPlayers[0].data().uid);
            setTo(newPlayers[0].data().uid);
            setFromName(newPlayers[0].data().name);
            setToName(newPlayers[0].data().name);
        });
      }, [game.id]);

    const formSubmit = async (e) => {
        e.preventDefault();
        let fromPlayer = players.find(player => player.data().uid === from);
        if (from === to) {
            showSnackbar("En kan ikke sender penger til seg selv")
        } else if (fromPlayer.data().money >= parseInt(amount)) {
            const db = firebase.firestore();
            db.collection('games').doc(game.id).collection('transactions').add({
                amount: parseInt(amount),
                from: from,
                fromName: fromName,
                to: to,
                toName: toName,
                time: new Date().getTime(),
            }).then(() => {
                var batch = db.batch();
                let fromDoc = db.collection('games').doc(game.id).collection('players').doc(from);
                batch.update(fromDoc, {money: firebase.firestore.FieldValue.increment(-parseInt(amount))});
                let toDoc = db.collection('games').doc(game.id).collection('players').doc(to);
                batch.update(toDoc, {money: firebase.firestore.FieldValue.increment(parseInt(amount))});
                
                batch.commit().then(() => showSnackbar("Transaksjonen ble gjennomført"));
            });
        } else {
            showSnackbar("Spilleren som betaler har ikke nok penger");
        }
    }

    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" className={classes.subtitle}>Ny transaksjon</Typography>
            <form className={classes.flex} autoComplete="off" onSubmit={formSubmit}>
                <TextField type="number" onChange={(e) => setAmount(e.target.value)} value={amount} className={classes.input} label="Sum" variant="outlined" required />
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="form-from">Fra</InputLabel>
                    <Select
                        native
                        value={from}
                        onChange={(e) => {setFrom(e.target.value); setFromName(e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text)}}
                        label="Fra"
                        inputProps={{
                            name: 'from',
                            id: 'form-from',
                        }}
                        >
                        {players.map((player) => 
                            <option key={player.data().uid} value={player.data().uid}>{player.data().name}</option>
                        )}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="form-to">Til</InputLabel>
                    <Select
                        native
                        value={to}
                        onChange={(e) => {setTo(e.target.value); setToName(e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text)}}
                        label="Til"
                        inputProps={{
                            name: 'to',
                            id: 'form-to',
                        }}
                        >
                        {players.map((player) => 
                            <option key={player.data().uid} value={player.data().uid}>{player.data().name}</option>
                        )}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    type='submit'
                    >
                    Send penger
                </Button>
            </form>
        </Paper>
    );
}

NewTransaction.propTypes = {
    showSnackbar: PropTypes.func.isRequired,
    game: PropTypes.object.isRequired,
};

export default NewTransaction;