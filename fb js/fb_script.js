console.log("Running GameWeb");

function fb_write() {
    //Get uid
    let uid = GLOBAL_user["uid"];
    //Check if logged in
    if (!uid) {
        alert("Please log in first");
        return;
    }
    //Get user information from form
    let userName = document.getElementById("userName").value;
    let userAge = document.getElementById("userAge").value;
    //Check if info is filled in
    if (!userName || !userAge) {
        alert("Please fill in the information");
        return;
    }
    //Check if info contains bad characters
    if (illegalCharaters.test(userName) == true || illegalCharaters.test(userAge) == true) {
        alert("Please fill in the information");
        return;
    }
    //Set data
    firebase.database().ref('/users/' + uid).set(
        {
            userName: userName,
            userAge: userAge,
            displayName: GLOBAL_user["displayName"],
            email: GLOBAL_user["email"],
            photoURL: GLOBAL_user["photoURL"],
            geoGame: 0,
            game: 0
        }
    );
    console.log("Data has been set");
}

//Characters that shouldn't be used
const illegalCharaters = /["'`<>]/;