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

//Geo game highscores

//Listener to check is highscore changes
function geoGameHighscoreListener() {
    firebase.database().ref('/geoGame').on('value', changeGeoHighscoreTable, fb_error);
}
//Arrays for top
let userArrayGeo = [];
let userScoreGeo = [];
//Change the geo game table
async function changeGeoHighscoreTable() {
    userArrayGeo = [];
    userScoreGeo = [];
    await firebase.database().ref('/geoGame').orderByChild("highscore").limitToLast(5).once('value', readGeo, fb_error);
    HTML_OUTPUT_GEO.innerHTML = '<table id="highscoreTable"><tr><th><h2>Name</h2></th><td>' +
    '<p>' + userArrayGeo[0] + '</p>' +
    '<p>' + userArrayGeo[1] + '</p>' +
    '<p>' + userArrayGeo[2] + '</p>' +
    '<p>' + userArrayGeo[3] + '</p>' +
    '<p>' + userArrayGeo[4] + '</p></td></tr><tr><th><h2>Score</h2></th><td>' +
    '<p>' + userScoreGeo[0] + '</p>' +
    '<p>' + userScoreGeo[1] + '</p>' +
    '<p>' + userScoreGeo[2] + '</p>' +
    '<p>' + userScoreGeo[3] + '</p>' +
    '<p>' + userScoreGeo[4] + '</p></td></tr></table>';;
}
//read it
function readGeo(snapshot) {
    console.log(snapshot.val());
    snapshot.forEach(showGeo);
}
//add
function showGeo(child) {
    userArrayGeo.push(child.val()["userName"]);
    userScoreGeo.push(Math.abs(child.val()["highscore"]));
}

//Game highcore

//Listener to check is highscore changes
function gameHighscoreListener() {
    firebase.database().ref('/game').on('value', changeGameHighscoreTable, fb_error);
}
//Arrays for top
let userArrayGame = [];
let userScoreGame = [];
//Change the geo game table
async function changeGameHighscoreTable() {
    userArrayGame = [];
    userScoreGame = [];
    await firebase.database().ref('/game').orderByChild("highscore").limitToLast(5).once('value', readGeo, fb_error);
    HTML_OUTPUT_GAME.innerHTML = '<table id="highscoreTable"><tr><th><h2>Name</h2></th><td>' +
    '<p>' + userArrayGame[0] + '</p>' +
    '<p>' + userArrayGame[1] + '</p>' +
    '<p>' + userArrayGame[2] + '</p>' +
    '<p>' + userArrayGame[3] + '</p>' +
    '<p>' + userArrayGame[4] + '</p></td></tr><tr><th><h2>Score</h2></th><td>' +
    '<p>' + userScoreGame[0] + '</p>' +
    '<p>' + userScoreGame[1] + '</p>' +
    '<p>' + userScoreGame[2] + '</p>' +
    '<p>' + userScoreGame[3] + '</p>' +
    '<p>' + userScoreGame[4] + '</p></td></tr></table>';;
}
//read it
function readGame(snapshot) {
    console.log(snapshot.val());
    snapshot.forEach(showGame);
}
//add
function showGame(child) {
    userArrayGame.push(child.val()["userName"]);
    userScoreGame.push(Math.abs(child.val()["highscore"]));
}



//Characters that shouldn't be used
const illegalCharaters = /["'`<>]/;