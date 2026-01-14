// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZaGWpJqnEJ9vPgtsqHB_sa21xwhMagno",
  authDomain: "quicksell-6bf53.firebaseapp.com",
  projectId: "quicksell-6bf53",
  storageBucket: "quicksell-6bf53.firebasestorage.app",
  messagingSenderId: "1080118632458",
  appId: "1:1080118632458:web:17c495b00c50e8943dfff3",
  measurementId: "G-VMQD7X67CS"
};

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

export default app;
