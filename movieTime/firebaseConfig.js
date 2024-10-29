import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyBYQCacJw9IKw6PlJZ8U9B6jEsEZoooPF8",
  authDomain: "movietime-ee3eb.firebaseapp.com",
  projectId: "movietime-ee3eb",
  storageBucket: "movietime-ee3eb.appspot.com",
  messagingSenderId: "256825046119",
  appId: "1:256825046119:web:37bd4d76285972e46910c2",
  measurementId: "G-3YRCHMRB6C",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



export { auth };

