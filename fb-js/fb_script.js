console.log("Running GameWeb");
//Html output
const HTML_OUTPUT_GEO = document.getElementById("databaseOutputGeo");
const HTML_OUTPUT_GAME = document.getElementById("databaseOutputGame");

//Get users data and add to database
async function fb_write() {
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
    await firebase.database().ref('/users/' + uid).set(
        {
            userName: String(userName),
            userAge: Number(userAge),
            displayName: GLOBAL_user["displayName"],
            email: GLOBAL_user["email"],
            photoURL: GLOBAL_user["photoURL"],
            role: 'user'
        }
    );
    console.log("Data has been set");
    document.getElementById("geo").style.visibility  = "visible";
    document.getElementById("game").style.visibility  = "visible";
    console.log("Games are visible");
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
    HTML_OUTPUT_GEO.innerHTML = '<table><tr><th>Name</th><th>Score</th></tr>'+
    '<tr><td>'+userArrayGeo[0]+'</td><td>'+userScoreGeo[0]+'</td></tr>' +
    '<tr><td>'+userArrayGeo[1]+'</td><td>'+userScoreGeo[1]+'</td></tr>' +
    '<tr><td>'+userArrayGeo[2]+'</td><td>'+userScoreGeo[2]+'</td></tr>' +
    '<tr><td>'+userArrayGeo[3]+'</td><td>'+userScoreGeo[3]+'</td></tr>' +
    '<tr><td>'+userArrayGeo[4]+'</td><td>'+userScoreGeo[4]+'</td></tr>' +
    '</table>';
}
//read it
function readGeo(snapshot) {
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
    await firebase.database().ref('/game').orderByChild("highscore").limitToLast(5).once('value', readGame, fb_error);
    HTML_OUTPUT_GAME.innerHTML = '<table><tr><th>Name</th><th>Score</th></tr>'+
    '<tr><td>'+userArrayGame[0]+'</td><td>'+userScoreGame[0]+'</td></tr>' +
    '<tr><td>'+userArrayGame[1]+'</td><td>'+userScoreGame[1]+'</td></tr>' +
    '<tr><td>'+userArrayGame[2]+'</td><td>'+userScoreGame[2]+'</td></tr>' +
    '<tr><td>'+userArrayGame[3]+'</td><td>'+userScoreGame[3]+'</td></tr>' +
    '<tr><td>'+userArrayGame[4]+'</td><td>'+userScoreGame[4]+'</td></tr>' +
    '</table>';
}
//read it
function readGame(snapshot) {
    snapshot.forEach(showGame);
}
//add
function showGame(child) {
    userArrayGame.push(child.val()["userName"]);
    userScoreGame.push(Math.abs(child.val()["highscore"]));
}



//Characters that shouldn't be used
const illegalCharaters = /["'`<>]/;