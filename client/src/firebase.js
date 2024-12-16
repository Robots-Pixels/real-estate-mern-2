// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mega-estate-9bd33.firebaseapp.com",
  projectId: "mega-estate-9bd33",
  storageBucket: "mega-estate-9bd33.firebasestorage.app",
  messagingSenderId: "333663783456",
  appId: "1:333663783456:web:4f9a671ae997e5c7990a45"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);