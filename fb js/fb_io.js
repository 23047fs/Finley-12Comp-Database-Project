/**************************************************************/
// Authentication
// Handles logging in and out
// This function creates a listener to check if users are logged into google; if not creates a popup
/**************************************************************/
let GLOBAL_user;
//Create listener
function fb_login() {
    authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin, fb_error)
}
//Checks if user is logged in, if not use fb_popupLogin
function fb_handleLogin(_user) {
    if (_user) {
        console.log("User is logged in")
        GLOBAL_user = _user; //Save user details into global variable
    } else {
        console.log("User not logged in - starting popup")
        fb_popupLogin();
        console.log("User is logged in");
    }
}
//Creates a popup and gets user google
function fb_popupLogin() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        GLOBAL_user = result.user;
        let uid = GLOBAL_user["uid"];
        //Create new user in database using uid
        firebase.database().ref('/users/' + uid).set(
            {
                role: 'user'
            });
        console.log("New user created");
    });
}
//Simple logout
function fb_logout() {
    if (GLOBAL_user == null) {
        alert("Please login first");
        console.log("User has failed to login first");
    } else {
        authenticationListener();
        firebase.auth().signOut();
        console.log("Logged out")
    };
}

/**************************************************************/
// Error handling
// Handles errors
// This function is active if an error happens, it console logs the error
/**************************************************************/
function fb_error(error) {
    console.error("An error has happened");
    console.error(error);
}