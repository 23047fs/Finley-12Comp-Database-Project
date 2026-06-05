/**************************************************************/
// fb_initialise()
// Initialize firebase, connect to the Firebase project.
// 
// Find the config data in the Firebase console. Cog wheel > Project Settings > General > Your Apps > SDK setup and configuration > Config
//
// Input:  n/a
// Return: n/a
/**************************************************************/
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcR-wxDz2JJXUlqbfOkgofE4nDxqueMvI",
  authDomain: "comp-project-28c74.firebaseapp.com",
  databaseURL: "https://comp-project-28c74-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comp-project-28c74",
  storageBucket: "comp-project-28c74.firebasestorage.app",
  messagingSenderId: "561132125335",
  appId: "1:561132125335:web:70cc4276e31eb2871dbdd2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// This log prints the firebase object to the console to show that it is working.
// As soon as you have the script working, delete this log.
console.log("Firebase initialize finished:");
console.log(firebase);