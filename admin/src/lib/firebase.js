import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATXgZc-b-9k8NUXHTua3NcgoNwHhIYGzI",
  authDomain: "ecommerce-cart-ce78a.firebaseapp.com",
  projectId: "ecommerce-cart-ce78a",
  storageBucket: "ecommerce-cart-ce78a.appspot.com",
  messagingSenderId: "313293236412",
  appId: "1:313293236412:web:942ebeda67041806ca08b9"

  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage();
