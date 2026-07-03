console.log("Running GameWeb");

/***********************************************/
//Login Check
/***********************************************/
//Checks if user has info in firebase already
function fb_checkIfPrevious() {
    let uid = GLOBAL_user["uid"];
    //Read if name in database
    firebase.database().ref('/users/' + uid + '/userName').once('value', fb_userNameCheck, fb_error);
}
//Check
function fb_userNameCheck(snapshot) {
    let dbData = snapshot.val();
    //If none
    if (!dbData) {
        alert("You have not previously logged in, please login");
    } else {
        //If done previously skip the wait
        window.location.href = "tables.html"; //Move pages
    }
}

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
    HTML_OUTPUT_CHECK.innerHTML = '<div class="tableLink"><h1><a class="link" href="tables.html">Next</a><br>You are now registered</h1></div>';
}

/***********************************************/
//Geo Game Highscores
/***********************************************/
//Listener to check is highscore changes
function fb_geoGameHighscoreListener() {
    firebase.database().ref('/geoGame').on('value', fb_changeGeoHighscoreTable, fb_error);
}
//Arrays for top 5
let userNameGeo = []; //Name
let userScoreGeo = []; //Score
let userPhotoGeo = []; //Photo
//Change the geo game table
async function fb_changeGeoHighscoreTable() {
    //Reset the arrays
    userNameGeo = [];
    userScoreGeo = [];
    userPhotoGeo = [];
    //Read the top 5 in order of score
    await firebase.database().ref('/geoGame').orderByChild("highscore").limitToFirst(5).once('value', readGeo, fb_error);
    //Table
    //Make a variable for the table    
    let geoTable = String("");
    //Make the table
    geoTable += '<table id="mainTableHighscore"><tr><th>Photo</th><th>Name</th><th>Score</th></tr>';
    //If score is there add it
    for (let i = 0; i < 5; i++) {
        if (userNameGeo[i] != null) {
            geoTable += '<tr><td>' + '<img class="img" src="' + userPhotoGeo[i] + '">' + '</td><td> ' + (i + 1) + ': ' + userNameGeo[i] + '</td><td>' + (i + 1) + ': ' + userScoreGeo[i] + '</td></tr>';
        } else {
            //Add the image if empty
            geoTable += '<tr><td><img class="img" src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Black_question_mark.png"></td><td>' + (i + 1) + ': ' + 'Empty' + '</td><td> ' + (i + 1) + ': ' + 'Empty' + '</td></tr>';
        }
    }
    //Finish the table
    geoTable += '</table>';
    //Add it to HTML
    HTML_OUTPUT_GEO.innerHTML = geoTable;
}
//read it for each
function readGeo(snapshot) {
    snapshot.forEach(showGeo);
}
//add to arrays
function showGeo(child) {
    //Get the userName from the uid and add it
    userNameGeo.push(child.val()["userName"]);
    //Set the highscore
    userScoreGeo.push((child.val()["highscore"]) * -1);
    //PhotoURL
    userPhotoGeo.push(child.val()["photoURL"]);
}

/***********************************************/
//Game Highscores // game - Snowball game
/***********************************************/
//Listener to check is highscore changes
function fb_gameHighscoreListener() {
    firebase.database().ref('/game').on('value', fb_changeGameHighscoreTable, fb_error);
}
//Arrays for top
let userNameGame = []; //Name
let userScoreGame = []; //Score
let userPhotoGame = []; //Photo
//Change the geo game table
async function fb_changeGameHighscoreTable() {
    //Reset arrays
    userNameGame = [];
    userScoreGame = [];
    userPhotoGame = [];
    //Read the top 5 in order of score
    await firebase.database().ref('/game').orderByChild("highscore").limitToFirst(5).once('value', readGame, fb_error);
    //Table
    //Make a variable for the table    
    let gameTable = String("");
    //Make the table
    gameTable += '<table id="mainTableHighscore"><tr><th>Photo</th><th>Name</th><th>Score</th></tr>';
    //If score is there add it
    for (let i = 0; i < 5; i++) {
        if (userNameGame[i] != null) {
            gameTable += '<tr><td>' + '<img class="img" src="' + userPhotoGame[i] + '">' + '</td><td> ' + (i + 1) + ': ' + userNameGame[i] + '</td><td>' + (i + 1) + ': ' + userScoreGame[i] + '</td></tr>';
        } else {
            //Add the image if empty
            gameTable += '<tr><td><img class="img" src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Black_question_mark.png"></td><td>' + (i + 1) + ': ' + 'Empty' + '</td><td> ' + (i + 1) + ': ' + 'Empty' + '</td></tr>';
        }
    }
    //Finish the table
    gameTable += '</table>';
    //Add it to HTML
    HTML_OUTPUT_GAME.innerHTML = gameTable;
}
//read it for each
function readGame(snapshot) {
    snapshot.forEach(showGame);
}
//add to arrays
function showGame(child) {
    //Get the userName from the uid and add it
    userNameGame.push(child.val()["userName"]);
    //Set the highscore
    userScoreGame.push((child.val()["highscore"]) * -1);
    //PhotoURL
    userPhotoGame.push(child.val()["photoURL"]);
}


//Characters that shouldn't be used
const CHAR = /["'`<>]/;