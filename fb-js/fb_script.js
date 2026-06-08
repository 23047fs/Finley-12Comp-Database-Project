console.log("Running GameWeb");
//Html output
const HTML_OUTPUT_GEO = document.getElementById("databaseOutputGeo");
const HTML_OUTPUT_GAME = document.getElementById("databaseOutputGame");

//Get users data and add to database
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
//Listener to check is highscore changes
function geoGameHighscoreListener() {
    firebase.database().ref('/geoGame').on('value', changeGeoHighscoreTable, fb_error);
}
//Change the geo game table
async function changeGeoHighscoreTable() {
    await firebase.database().ref('/geoGame').orderByChild("highscore").limitToLast(5).once('value', readGeo, fb_error);
    HTML_OUTPUT_GEO.innerHTML = '<table id="highscoreTable"><tr><th><h2>Name</h2></th><td>' +
        '<p>'+userArray[1]+'</p>' +
        '<p>'+userArray[2]+'</p>' +
        '<p>'+userArray[3]+'</p>' +
        '<p>'+userArray[4]+'</p>' +
        '<p>'+userArray[5]+'</p></td></tr><tr><th><h2>Score</h2></th><td>'+
        '<p>'+userScore[1]+'</p>' +
        '<p>'+userScore[2]+'</p>' +
        '<p>'+userScore[3]+'</p>' +
        '<p>'+userScore[4]+'</p>' +
        '<p>'+userScore[5]+'</p></td></tr></table>'
}
//read it
function readGeo(snapshot) {
    console.log(snapshot);
    snapshot.forEach(show);
}
let userArray = [];
let userScore = [];
function show(child) {
    userArray.push(child.key);
    userScore.push(child.val());
}




//Characters that shouldn't be used
const illegalCharaters = /["'`<>]/;