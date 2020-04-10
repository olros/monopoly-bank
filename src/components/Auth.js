import React, { useState } from 'react';
import PropTypes from 'prop-types';
import firebase from '../firebase';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    buttonSmall: {
        height: 35,
        marginBottom: 8,
    },
}));

function Auth(props) {
    const classes = useStyles();
    const { showSnackbar } = props;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [login, setLogin] = useState(true);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');

    const formSubmit = (e) => {
        e.preventDefault();
        if (login) {
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then((data) => showSnackbar("Vellykket innlogging"))
                .catch((error) => showSnackbar(error.code + " - " + error.message));
        } else {
            if (password === confirmPassword) {
                firebase.auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then((data) => {
                        const user = firebase.auth().currentUser;
                        user.updateProfile({
                            displayName: name
                        })
                        .then(() => showSnackbar("Registreringen var vellykket!"))
                        .catch((error) => showSnackbar(error.code + " - " + error.message));
                    })
                    .catch((error) => showSnackbar(error.code + " - " + error.message));
            } else {
                showSnackbar("Passordene er ikke like");
            }
        }
    }

    const getNewPassword = () => {
        firebase.auth().sendPasswordResetEmail(emailAddress)
            .then(() => {
                showSnackbar("Epost med link er sendt");
                setForgotPassword(false);
                setEmailAddress('');
            }).catch((error) => showSnackbar(error.code + " - " + error.message));
    }

    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" className={classes.subtitle}>{login ? "Logg inn" : "Opprett bruker"}</Typography>
            <form className={classes.flex} autoComplete="off" onSubmit={formSubmit}>
                {!login && <TextField onChange={(e) => setName(e.target.value)} value={name} className={classes.input} label="Navn" variant="outlined" required />}
                <TextField type="email" onChange={(e) => setEmail(e.target.value)} value={email} className={classes.input} label="Epost" variant="outlined" required />
                <TextField type="password" onChange={(e) => setPassword(e.target.value)} value={password} className={classes.input} label="Passord" variant="outlined" required />
                {!login && <TextField type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} className={classes.input} label="Bekreft passord" variant="outlined" required />}
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    type='submit'
                    >
                    {login ? "Logg inn" : "Opprett bruker"}
                </Button>
                <Button
                    color="secondary"
                    className={classes.buttonSmall}
                    onClick={() => setLogin(!login)}
                    >
                    {login ? "Ny bruker" : "Logg inn"}
                </Button>
                <Button
                    color="secondary"
                    className={classes.buttonSmall}
                    onClick={() => setForgotPassword(true)}
                    >
                    Glemt passord?
                </Button>
            </form>
            <Dialog open={forgotPassword} onClose={() => setForgotPassword(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Glemt passord</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Skriv inn eposten din så sender vi deg en link så du kan lage et nytt passord
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Epost"
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setForgotPassword(false)} color="primary">
                        Avbryt
                    </Button>
                    <Button onClick={() => getNewPassword()} color="primary">
                        Få nytt passord
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

Auth.propTypes = {
    showSnackbar: PropTypes.func.isRequired,
};

export default Auth;