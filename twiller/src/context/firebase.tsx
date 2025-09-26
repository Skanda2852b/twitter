// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOXEhomaAQRZLMCSlvejB0hxnluetxvvI",
  authDomain: "twiller-92db3.firebaseapp.com",
  projectId: "twiller-92db3",
  storageBucket: "twiller-92db3.firebasestorage.app",
  messagingSenderId: "516611052243",
  appId: "1:516611052243:web:378f2ab9d3bfd97509fa26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export default app


