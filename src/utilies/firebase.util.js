import firebase from 'firebase';
const config = {
   apiKey: "AIzaSyDBfnZIyVGMgv3wh148XSHIrXdoDnV65to",
    authDomain: "icattle.firebaseapp.com",
    databaseURL: "https://icattle.firebaseio.com",
    projectId: "icattle",
    storageBucket: "icattle.appspot.com",
    messagingSenderId: "152026020909",
    appId: "1:152026020909:web:0d499c398c239b1da74ca4",
    measurementId: "G-CC0X2F6XRX"
};
  
firebase.initializeApp(config);
export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();