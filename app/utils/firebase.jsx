import { initializeApp } from 'firebase/app';
import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCfsgMkzuuTmkViNaiyrvpMzUBEf92Wrec",
    authDomain: "first-mobile-app-e2719.firebaseapp.com",
    projectId: "first-mobile-app-e2719",
    storageBucket: "first-mobile-app-e2719.appspot.com",
    messagingSenderId: "64794065283",
    appId: "1:64794065283:web:7f5d59eb1e8bc2f6381eb6"
  };
  
export const firebaseApp = firebase.initializeApp(firebaseConfig)
  