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

// Icons
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

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

function BankTransaction(props) {
    const classes = useStyles();
    const { showSnackbar, game } = props;
    const [players, setPlayers] = useState([]);
    const [playerUid, setPlayerUid] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [amount, setAmount] = useState(0);
    const [pay, setPay] = useState(false);

    useEffect(() => {
        const db = firebase.firestore();
        db.collection('games').doc(game.id).collection('players').onSnapshot((querySnapshot) => {
            let newPlayers = [];
            querySnapshot.forEach((doc) => newPlayers.push(doc));
            setPlayers(newPlayers);
            setPlayerUid(newPlayers[0].data().uid);
            setPlayerName(newPlayers[0].data().name);
        });
      }, [game.id]);

    const formSubmit = async (e) => {
        e.preventDefault();
        let player = players.find(player => player.data().uid === playerUid);
        if (pay) {
            if (player.data().money >= parseInt(amount)) {
                const db = firebase.firestore();
                db.collection('games').doc(game.id).collection('transactions').add({
                    amount: parseInt(amount),
                    from: playerUid,
                    fromName: playerName,
                    to: '--',
                    toName: 'Banken',
                    time: new Date().getTime(),
                }).then(() => {
                    var batch = db.batch();
                    let fromDoc = db.collection('games').doc(game.id).collection('players').doc(playerUid);
                    batch.update(fromDoc, {money: firebase.firestore.FieldValue.increment(-parseInt(amount))});
                    
                    batch.commit().then(() => showSnackbar("Transaksjonen ble gjennomført"));
                });
            } else {
                showSnackbar("Spilleren har ikke nok penger");
            }
        } else {
            const db = firebase.firestore();
                db.collection('games').doc(game.id).collection('transactions').add({
                    amount: parseInt(amount),
                    from: '--',
                    fromName: 'Banken',
                    to: playerUid,
                    toName: playerName,
                    time: new Date().getTime(),
                }).then(() => {
                    var batch = db.batch();
                    let toDoc = db.collection('games').doc(game.id).collection('players').doc(playerUid);
                    batch.update(toDoc, {money: firebase.firestore.FieldValue.increment(parseInt(amount))});
                    
                    batch.commit().then(() => showSnackbar("Transaksjonen ble gjennomført"));
                });
        }
    }

    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" className={classes.subtitle}>Bank</Typography>
            <form className={classes.flex} autoComplete="off" onSubmit={formSubmit}>
                <Button
                    variant={!pay ? "outlined": "contained"}
                    color="secondary"
                    className={classes.button}
                    startIcon={<RemoveRoundedIcon />}
                    onClick={() => setPay(true)}
                >
                    Betal
                </Button>
                <Button
                    variant={pay ? "outlined": "contained"}
                    color="secondary"
                    className={classes.button}
                    startIcon={<AddRoundedIcon />}
                    onClick={() => setPay(false)}
                >
                    Motta
                </Button>
                <TextField type="number" onChange={(e) => setAmount(e.target.value)} value={amount} className={classes.input} label="Sum" variant="outlined" required />
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="form-to">Spiller</InputLabel>
                    <Select
                        native
                        value={playerUid}
                        onChange={(e) => {setPlayerUid(e.target.value); setPlayerName(e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text)}}
                        label="Spiller"
                        inputProps={{
                            name: 'player',
                            id: 'form-player',
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
                    {pay ? "Betal penger til banken" : "Motta penger fra banken"}
                </Button>
            </form>
        </Paper>
    );
}

BankTransaction.propTypes = {
    showSnackbar: PropTypes.func.isRequired,
    game: PropTypes.object.isRequired,
};

export default BankTransaction;