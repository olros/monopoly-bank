import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import URLS from './URLS';
import firebase from './firebase';  

// Theme
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import './assets/css/main.css';

// Project containers
import Landing from './containers/Landing';
import Game from './containers/Game';
import Invite from './containers/Invite';

const AuthRoute = (props) => {
    const [auth, setAuth] = useState(null);
    firebase.auth().onAuthStateChanged((user) => setAuth(user));
    if(auth) {
       return <Route {...props} />
    }
    return <Route path={URLS.landing} component={Landing} />
 }

function App() {
    return (
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <Switch>
                    <AuthRoute path={URLS.game.concat(':id/')} component={Game} />
                    <AuthRoute path={URLS.invite.concat(':id/')} component={Invite} />

                    <Route path={URLS.landing} component={Landing} />
                </Switch>
            </MuiThemeProvider>
        </BrowserRouter>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
