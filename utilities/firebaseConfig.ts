import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebase from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";

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

// Initialize Firebase and Auth
let app;
let auth: Auth;
if (firebase.getApps().length === 0) {
  app = firebase.initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = firebase.getApp();
  auth = getAuth();
}

export { auth };
