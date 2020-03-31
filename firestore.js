import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase';

initializeApp(firebaseConfig);

const db = firebase.firestore();
