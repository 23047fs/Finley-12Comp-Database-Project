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
    if (CHAR.test(userName) == true || CHAR.test(userAge) == true) {
        alert("'`<> are not allowed please try a different name");
        return;
    }
    //Set data
    await firebase.database().ref('/users/' + uid).set({
        displayName: GLOBAL_user["displayName"],
        email: GLOBAL_user["email"],
        photoURL: GLOBAL_user["photoURL"],
        userName: String(userName),
        userAge: Number(userAge),
        role: String("user")
    });
    //Reset the html
    document.getElementById("userName").value = "";
    document.getElementById("userAge").value = "";
    console.log("Data has been reset");

    //Insert next link
    HTML_OUTPUT_CHECK.innerHTML = '<div class="tableLink"><h1><a class="link" href="tables.html">Next</a></h1><h1>You are now registered</h1></div>';
}

//Checks if user has info in firebase already
function fb_checkIfPrevious() {
    let uid = GLOBAL_user["uid"];
    firebase.database().ref('/users/' + uid + '/userName').once('value', fb_userNameCheck, fb_error);
}

function fb_userNameCheck(snapshot) {
    let dbData = snapshot.val();
    if (!dbData) {
        HTML_OUTPUT_CHECK.innerHTML = '<div class="tableLink"><h1>You are not registered yet</h1></div>';
    } else {
        //Make the games link visible
        HTML_OUTPUT_CHECK.innerHTML = '<div class="tableLink"><h1><a class="link" href="tables.html">Next</a></h1><h1>You have previously registered</h1></div>';
    }
}

function skipLogin() {
    //Show the container
    document.getElementById("container").style.visibility = "visible";
    console.log("Registration is visible");
    //Make the games in table visible
    document.getElementById("game").style.visibility = "visible";
    document.getElementById("geo").style.visibility = "visible";
    console.log("Games are visible");
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
    //Table
    //Make a variable for the table    
    let geoTable = String("");
    //Make the table
    geoTable += '<table id="mainTableHighscore"><tr><th>Name</th><th>Score</th></tr>';
    //If score is there add it
    for (let i = 0; i < 4; i++) {
        if (userArrayGeo[i] != null) {
            geoTable += '<tr><td>' + (i + 1) + ': ' + userArrayGeo[i] + '</td><td>' + (i + 1) + ': ' + userScoreGeo[i] + '</td></tr>';
        } else {
            geoTable += '<tr><td>' + (i + 1) + ': ' + 'Empty' + '</td><td>' + (i + 1) + ': ' + 'Empty' + '</td></tr>';
        }
    }
    //Finish the table
    geoTable += '</table>';
    //Add it to HTML
    HTML_OUTPUT_GEO.innerHTML = geoTable;
}
//read it
function readGeo(snapshot) {
    snapshot.forEach(showGeo);
}
//add
function showGeo(child) {
    //Get the userName from the uid and add it
    userArrayGeo.push(child.val()["userName"]);
    //Set the highscore
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
    //Table
    //Make a variable for the table    
    let gameTable = String("");
    //Make the table
    gameTable += '<table id="mainTableHighscore"><tr><th>Name</th><th>Score</th></tr>';
    //If score is there add it
    for (let i = 0; i < 4; i++) {
        if (userArrayGame[i] != null) {
            gameTable += '<tr><td>' + (i + 1) + ': ' + userArrayGame[i] + '</td><td>' + (i + 1) + ': ' + userScoreGame[i] + '</td></tr>';
        } else {
            gameTable += '<tr><td>' + (i + 1) + ': ' + 'Empty' + '</td><td>' + (i + 1) + ': ' + 'Empty' + '</td></tr>';
        }
    }
    //Finish the table
    gameTable += '</table>';
    //Add it to HTML
    HTML_OUTPUT_GAME.innerHTML = gameTable;
}
//read it
function readGame(snapshot) {
    snapshot.forEach(showGame);
}
//add
function showGame(child) {
    //Get the userName from the uid and add it
    userArrayGame.push(child.val()["userName"]);
    //Set the highscore
    userScoreGame.push(Math.abs(child.val()["highscore"]));
}




//Characters that shouldn't be used
const CHAR = /["'`<>]/;