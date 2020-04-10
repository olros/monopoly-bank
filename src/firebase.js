import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "monopol.ga",
  databaseURL: "https://monopol-2020.firebaseio.com",
  projectId: "monopol-2020",
  storageBucket: "monopol-2020.appspot.com",
  messagingSenderId: "320206071252",
  appId: "1:320206071252:web:fde3028226c52d7104e241",
  measurementId: "G-0FWYKG3PN4"
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
  firebase.analytics();
}
export default firebase;