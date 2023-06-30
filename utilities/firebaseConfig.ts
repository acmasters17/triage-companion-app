import { initializeApp } from "firebase/app";
import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";

// Config Object
export const firebaseConfig = {
  apiKey: "AIzaSyDzJc28cxw8Z9sgmTTvkc6D39gkEgzaH4c",
  authDomain: "triage-companion-app.firebaseapp.com",
  projectId: "triage-companion-app",
  storageBucket: "triage-companion-app.appspot.com",
  messagingSenderId: "57622065441",
  appId: "1:57622065441:web:4c95828a23e0a779f34e60",
  measurementId: "G-J9NPEE7LCF",
};

// Initialize Firebase
let app;
if (firebase.getApps().length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.getApp();
}

const auth = getAuth();

export { auth };
