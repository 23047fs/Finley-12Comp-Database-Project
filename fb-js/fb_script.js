console.log("Running GameWeb");

/***********************************************/
//Html Information
/***********************************************/

//Html output
const HTML_OUTPUT_GEO = document.getElementById("databaseOutputGeo");
const HTML_OUTPUT_GAME = document.getElementById("databaseOutputGame");
const HTML_OUTPUT_CHECK = document.getElementById("databaseOutputCheck");

//Get users data and add to database
async function fb_write() {
    //Get uid
    const uid = GLOBAL_user["uid"];
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
    await firebase.database().ref('/users/' + uid + '/userName').set(String(userName));
    await firebase.database().ref('/users/' + uid + '/userAge').set(Number(userAge));
    //Reset the html
    document.getElementById("userName").value = "";
    document.getElementById("userAge").value = "";
    console.log("Data has been reset");
    //Make the games visible
    document.getElementById("geo").style.visibility = "visible";
    document.getElementById("game").style.visibility = "visible";
    console.log("Games are visible");
    HTML_OUTPUT_CHECK.innerHTML = '<h2>You are registered</h2>'
}
//Checks if user has info in firebase already
function fb_check() {
    const uid = GLOBAL_user["uid"];
    firebase.database().ref('/users/' + uid + '/userName').once('value', fb_userNameCheck, fb_error);
}

function fb_userNameCheck(snapshot) {
    const dbData = snapshot.val();
    if (!dbData) {
        return;
    } else {
        //Make the games visible
        document.getElementById("geo").style.visibility = "visible";
        document.getElementById("game").style.visibility = "visible";
        console.log("Games are visible");
        HTML_OUTPUT_CHECK.innerHTML = '<h2>You have previously registered</h2>'
    }
}

/***********************************************/
//Geo game highscores
/***********************************************/
//Listener to check is highscore changes
function fb_geoGameHighscoreListener() {
    firebase.database().ref('/geoGame').on('value', fb_changeGeoHighscoreTable, fb_error);
}
//Arrays for top 5
//Name
let userArrayGeo = [];
//Score
let userScoreGeo = [];
//Change the geo game table
async function fb_changeGeoHighscoreTable() {
    userArrayGeo = [];
    userScoreGeo = [];
    await firebase.database().ref('/geoGame').orderByChild("highscore").limitToLast(5).once('value', readGeo, fb_error);
    //Set them to say "" if no information


    HTML_OUTPUT_GEO.innerHTML = '<table id="mainTableHighscore"><tr><th>Name</th><th>Score</th></tr>' +
        '<tr><td>1: ' + userArrayGeo[0] + '</td><td>1: ' + userScoreGeo[0] + '</td></tr>' +
        '<tr><td>2: ' + userArrayGeo[1] + '</td><td>2: ' + userScoreGeo[1] + '</td></tr>' +
        '<tr><td>3: ' + userArrayGeo[2] + '</td><td>3: ' + userScoreGeo[2] + '</td></tr>' +
        '<tr><td>4: ' + userArrayGeo[3] + '</td><td>4: ' + userScoreGeo[3] + '</td></tr>' +
        '<tr><td>5: ' + userArrayGeo[4] + '</td><td>5: ' + userScoreGeo[4] + '</td></tr>' +
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

/***********************************************/
//Game highscores
/***********************************************/
//Listener to check is highscore changes
function fb_gameHighscoreListener() {
    firebase.database().ref('/game').on('value', fb_changeGameHighscoreTable, fb_error);
}
//Arrays for top
let userArrayGame = [];
let userScoreGame = [];
//Change the geo game table
async function fb_changeGameHighscoreTable() {
    userArrayGame = [];
    userScoreGame = [];
    await firebase.database().ref('/game').orderByChild("highscore").limitToLast(5).once('value', readGame, fb_error);
    HTML_OUTPUT_GAME.innerHTML = '<table id="mainTableHighscore"><tr><th>Name</th><th>Score</th></tr>' +
        '<tr><td>1: ' + userArrayGame[0] + '</td><td>1: ' + userScoreGame[0] + '</td></tr>' +
        '<tr><td>2: ' + userArrayGame[1] + '</td><td>2: ' + userScoreGame[1] + '</td></tr>' +
        '<tr><td>3: ' + userArrayGame[2] + '</td><td>3: ' + userScoreGame[2] + '</td></tr>' +
        '<tr><td>4: ' + userArrayGame[3] + '</td><td>4: ' + userScoreGame[3] + '</td></tr>' +
        '<tr><td>5: ' + userArrayGame[4] + '</td><td>5: ' + userScoreGame[4] + '</td></tr>' +
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