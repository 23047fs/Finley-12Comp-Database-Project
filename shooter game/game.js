/*******************************************************/
// P5.play: Project Game
/// Written by Finley
/*******************************************************/

/*******************************************************/
// setup()
/*******************************************************/

//Constants
//All constants are here to allow for easy changes
const canvaWidth = 500;
const canvaHeight = 500;
const enemyBallDiameter = 24;
const minBallSpeed = 2;
const maxBallSpeed = 4;
const minBeamSpeed = 3;
const maxBeamSpeed = 5;
const numberOfScoreBallsLeft = 8;
const scoreBallDiameter = 15;
const playerSize = 30;
const playerJumpHeight = 9;
const playerSpeed = 4;
const timeOver = 30;
const numberOfEnemyStages = 3;

//Variables
//Screen phase: start = Start screen, game = game screen, lose = lose screen, win = win screen
let screenPhase = "start";
let screenPhaseSetup = false;
let scoreBallsCollected = 0;
let playerScore = 0;
let secondTimer = 0;
let timerSurvived = 0;
let restarted = false;
let globalScore = 0;
let savedFrameCount = 0;
let highscore = 0;
let scoreMulti = 1;
let finalScoreMulti = 1;
let chosenSide;
let numberOfEnemyBallsUp = 7;
let numberOfEnemyBeamsUp = 5;
let numberOfEnemiesInBeamsUp = 15;

//Arrays
//Enemy ball sprites
let enemyBallSpriteArray = [];
//Enemy beam sprites
let enemyBeamSpriteArray = [];
//Score balls
let scoreBallSpriteArray = [];


function preload() {
    //Loading the images for assets
    imgSnowBall = loadImage('assets/images/Snowball.png');
    imgBackground = loadImage('assets/images/Background.png');
    imgPlayerCat = loadImage('assets/images/Cat.png');
    imgPlayerTabbyCat = loadImage('assets/images/TabbyCat.png');

}

function setup() {
    //Setup
    console.log("Project Game");
    cnv = new Canvas(canvaWidth, canvaHeight);
    //Center of canvas is 250, 250
    world.gravity.y = 20;

    //Groups
    //Group that has 'k' physics but doesn't allow the player to jump on. Eg walls
    floorGroup = new Group();
    //Group that has 'k' physics and allows the player to jump on. Eg the floor
    hitBoxGroup = new Group();
    //Group for enemy sprites
    enemyGroup = new Group();
    //Group for scoreball sprites
    scoreBallGroup = new Group();

    //Functions
    setupPhases();
    chosenSide = random([0, 1]);

}

//Set up / sprite creation for screen phases
function setupPhases() {
    if (screenPhase == "start") {
        //Start screen
        startButtonSprite();
        controlButtonSprite();
        titleButtonSprite();
        console.log("Start Screen")

    } else if (screenPhase == "game") {
        //Delete previous sprites
        deleteStartButtonSprite();
        deleteControlButtonSprite();
        deleteTitleButtonSprite();

        if (restarted == true) {
            deleteRestartButtonSprite();
            deleteTitleButtonSprite();
        };

        //Game screen
        playerSprite();
        wallSprite();
        enemySprite();
        scoreBallSprite();
        console.log("Game Screen")

        //Game timers
        secondTimer = 0;

    } else if (screenPhase == "lose") {
        //Delete previous sprites
        deletePlayerSprite();
        deleteWallSprite();
        deleteEnemySprite();
        deleteScoreBallSprite();

        //Load new sprites
        restartButtonSprite();
        titleButtonSprite();

        //Set final score
        timerSurvived = secondTimer;
        finalScoreMulti = scoreMulti;
        playerScore = scoreBallsCollected * finalScoreMulti;
        globalScore = globalScore + playerScore;
        //Set highscore
        if (highscore < playerScore) {
            highscore = playerScore;
        };

        //Lose screen
        console.log("Lose Screen")

    } else if (screenPhase == "win") {
        //Delete previous sprites
        deletePlayerSprite();
        deleteWallSprite();
        deleteEnemySprite();
        deleteScoreBallSprite();

        //Load new sprites
        restartButtonSprite();
        titleButtonSprite();

        //Set final score and time
        timerSurvived = secondTimer;
        finalScoreMulti = scoreMulti;
        playerScore = scoreBallsCollected * finalScoreMulti;
        globalScore = globalScore + playerScore;
        //Set highscore
        if (highscore < playerScore) {
            highscore = playerScore;
        };

        //Win screen
        console.log("Win Screen")

    };

}

function titleButtonSprite() {
    //Title Button
    titleButton = new Sprite(250, 100, 300, 50, 'n');
    titleButton.color = '#92a5f7';
    titleButton.text = "Ball " + "Rain";
    titleButton.textSize = 30;
}

function deleteTitleButtonSprite() {
    titleButton.remove();
}

function startButtonSprite() {
    //Start Button
    startButton = new Sprite(250, 200, 240, 30, 'n');
    startButton.color = '#62e0ff';
    startButton.text = "Press Space to start";
    startButton.textSize = 20;
}

function deleteStartButtonSprite() {
    startButton.remove();
}

function controlButtonSprite() {
    //Control Button
    controlButton = new Sprite(250, 235, 240, 30, 'n');
    controlButton.color = '#62e0ff';
    controlButton.text = "Press C to see controls";
    controlButton.textSize = 20;
}

function deleteControlButtonSprite() {
    controlButton.remove();
}

function restartButtonSprite() {
    //Restart Button
    restartButton = new Sprite(250, 260, 240, 30, 'n');
    restartButton.color = '#62e0ff';
    restartButton.text = "Press Space to restart";
    restartButton.textSize = 20;
}

function deleteRestartButtonSprite() {
    restartButton.remove();
}

function playerSprite() {
    //Player
    player = new Sprite(250, 250, playerSize, playerSize, 'd');
    player.image = (imgPlayerCat);
    imgPlayerCat.resize(playerSize, playerSize);
}

function deletePlayerSprite() {
    player.remove();
}

function wallSprite() {
    //Walls
    topWall = new Sprite(canvaWidth / 2, 0, canvaHeight, 10, 'k');
    topWall.color = '#a7f9ff';
    topWall.strokeWeight = 0;
    hitBoxGroup.add(topWall);

    bottomWall = new Sprite(canvaWidth / 2, canvaHeight, canvaHeight, 10, 'k');
    bottomWall.color = '#a7f9ff';
    bottomWall.strokeWeight = 0;
    hitBoxGroup.add(bottomWall);

    leftWall = new Sprite(0, canvaHeight / 2, canvaHeight, 10, 'k');
    leftWall.rotation = 90;
    leftWall.color = '#a7f9ff';
    leftWall.strokeWeight = 0;
    hitBoxGroup.add(leftWall);

    rightWall = new Sprite(canvaWidth, canvaHeight / 2, canvaHeight, 10, 'k');
    rightWall.rotation = 90;
    rightWall.color = '#a7f9ff';
    rightWall.strokeWeight = 0;
    hitBoxGroup.add(rightWall);
}

function deleteWallSprite() {
    hitBoxGroup.deleteAll();
    floorGroup.deleteAll();
}

function enemySprite() {
    //Enemy balls
    for (i = 0; i < numberOfEnemyBallsUp; i++) {
        enemyBallUp = new Sprite(random(25, 475), random(-200, -10), enemyBallDiameter, 'k');
        enemyBallUp.image = (imgSnowBall);
        imgSnowBall.resize(enemyBallDiameter, enemyBallDiameter);
        enemyBallUp.strokeWeight = 0;
        enemyBallUp.vel.y = random(minBallSpeed, maxBallSpeed);
        enemyBallSpriteArray.push(enemyBallUp);
        enemyGroup.add(enemyBallUp);
    };

    //Improved enemy beams
    for (i = 0; i < numberOfEnemyBeamsUp; i++) {
        let enemyBeamX = random(15, 475);
        for (ii = 0; ii < numberOfEnemiesInBeamsUp; ii++) {
            //
            enemyBeamUp = new Sprite(enemyBeamX + random(-8, 8), -(random(5, 10) * ii) - 40, enemyBallDiameter, 'k');
            enemyBeamUp.image = (imgSnowBall);
            imgSnowBall.resize(enemyBallDiameter, enemyBallDiameter);
            enemyBeamUp.strokeWeight = 0;
            enemyBeamUp.vel.y = 0;
            enemyBeamSpriteArray.push(enemyBeamUp);
            enemyGroup.add(enemyBeamUp);
        };
    };
}

function deleteEnemySprite() {
    enemyGroup.deleteAll();
}

function scoreBallSprite() {
    //Score balls
    for (i = 0; i < numberOfScoreBallsLeft; i++) {
        scoreBall = new Sprite(random(50, 450), random(50, 450), scoreBallDiameter, 'k');
        scoreBall.image = "⭐";
        scoreBall.strokeWeight = 0;
        scoreBallSpriteArray.push(scoreBall);
        scoreBallGroup.add(scoreBall);
    }
}

function deleteScoreBallSprite() {
    scoreBallGroup.deleteAll();
}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {
    background(imgBackground);

    //Visual Variables
    textFunction();

    //Timer
    if (frameCount == savedFrameCount + 60) {
        secondTimer = secondTimer + 1;
        savedFrameCount = frameCount;
    };

    if (secondTimer % 5 === 0) {
        scoreMulti = secondTimer / 10 + 1;
    };

    //Screen Phases
    //What happens when the screen phases switch, what is deleted, what functions are drawn
    if (screenPhase == "start") {
        //Start screen
        controlButtonFunction();
        startButtonFunction();

        //Texts
        textFont("fontBold");
        textAlign("left")
        textSize(15);
        text("Credits Background by Dreamy Pixel. licensed under CC-BY 4.0", 10, 480);
        textSize(20);

    } else if (screenPhase == "game") {
        //One time setup of sprites
        if (screenPhaseSetup == true) {
            //Setup
            setupPhases();
            screenPhaseSetup = false;
        };

        //Game screen
        keyboardMovement();
        enemyFunction();
        timerFunction();
        scoreBallFunction();


        //Stages
        numberOfEnemyBallsUp = 7;
        numberOfEnemyBeamsUp = 5;
        numberOfEnemiesInBeamsUp = 15;
        for (i = 0; i < numberOfEnemyStages; i++) {
            if (secondTimer <= timeOver / numberOfEnemyStages) {
                enemyStage1();
            };
            if (secondTimer >= (timeOver / numberOfEnemyStages) + 2 && secondTimer <= (timeOver / numberOfEnemyStages) * 2) {
                enemyStage2();
                if (chosenSide == 0) {
                    leftWall.color = '#e60b0b7a';
                } else if (chosenSide == 1) {
                    rightWall.color = '#e60b0b7a';
                }
            };
            if (secondTimer >= ((timeOver / numberOfEnemyStages) * 2) - 5 && secondTimer <= (timeOver / numberOfEnemyStages) * 3) {
                enemyStage3();
            };
        }


        //Player skin
        if (globalScore >= 100) {
            player.image = (imgPlayerTabbyCat);
            imgPlayerTabbyCat.resize(playerSize, playerSize);
        };

    } else if (screenPhase == "lose") {
        if (screenPhaseSetup == true) {
            //Setup
            setupPhases();
            screenPhaseSetup = false;
        };

        //Lose screen
        textFont("fontBold");
        textAlign("center")
        textSize(18);
        text("You have lost the game", 250, 150);
        text("You survived: " + timerSurvived + " seconds", 250, 175);
        text("You collected: " + scoreBallsCollected + " stars", 250, 200);
        textFont("Ultra");
        textSize(25);
        text("You have scored: " + playerScore, 245, 230);
        textFont("fontBold");
        textSize(15);
        textAlign("left");
        text("Credits Background by Dreamy Pixel. licensed under CC-BY 4.0", 10, 480);
        textSize(20);

        //Restart
        restartButtonFunction();

    } else if (screenPhase == "win") {
        if (screenPhaseSetup == true) {
            //Setup
            setupPhases();
            screenPhaseSetup = false;
        };

        //Win screen
        textFont("fontBold");
        textAlign("center")
        text("Wow you have won the game", 250, 160);
        text("You survived: " + timerSurvived + " seconds", 250, 180);
        text("You collected: " + scoreBallsCollected + " stars", 250, 200);
        textFont("Ultra");
        textSize(25);
        text("You have scored: " + playerScore, 245, 230);
        textFont("fontBold");
        textSize(15);
        textAlign("left");
        text("Credits Background by Dreamy Pixel. licensed under CC-BY 4.0", 10, 480);
        textSize(20);

        //Restart
        restartButtonFunction();
    };
};

function textFunction() {
    textSize(20);
    textFont("fontBold");
    textAlign("left");
    if (kb.pressing("z")) {
        text("Mouse X " + round(mouse.x), 10, 20);
        text("Mouse Y " + round(mouse.y), 10, 40);
    } else {
        text("Stars collected: " + scoreBallsCollected, 10, 20);
        if (screenPhase == "game") {
            text("Timer " + secondTimer, 180, 20);
        } else {
            text("Timer " + timerSurvived, 180, 20);
        };
        if (screenPhase == "game") {
            text("Score Multiplier " + scoreMulti, 300, 20);
        } else {
            text("Score Multiplier " + finalScoreMulti, 300, 20);
        };
        text("Highscore: " + highscore, 10, 40);
    };
}

//Switching screens and screen phases
function controlButtonFunction() {
    //Start button
    if (kb.pressing('c')) {
        textFont("fontBold");
        textAlign("center");
        textSize(18);
        text("Collect as many yellow stars", 250, 370);
        text("Dodge the snowballs", 250, 390);
        text("The score is the number of yellow stars times by the time survived", 250, 410);
        text("To move it is W, A, S, D, and hold W on the walls and roof to climb", 250, 430);
    };
};

function startButtonFunction() {
    //Start button
    if (kb.presses('space')) {
        screenPhase = "game"
        screenPhaseSetup = true;
        scoreBallsCollected = 0;
        playerScore = 0;
        secondTimer = 0;
        timerSurvived = 0;
    }
}

function restartButtonFunction() {
    //Start button
    if (kb.presses('space')) {
        screenPhase = "game"
        screenPhaseSetup = true;
        restarted = true;
        scoreBallsCollected = 0;
        playerScore = 0;
        secondTimer = 0;
        timerSurvived = 0;
        console.log("Restart");
    }
}

//Movement and rotation with keyboard inputs
function keyboardMovement() {
    //Resistance
    player.vel.x = player.vel.x / 1.043;
    player.rotationSpeed = player.rotationSpeed / 1.035;

    //Left
    if (kb.pressing('a') || kb.pressing('arrowLeft')) {
        // Set sprite's velocity to the left
        player.vel.x = -1 * playerSpeed;
    }

    //Right
    if (kb.pressing('d') || kb.pressing('arrowRight')) {
        // Set sprite's velocity to the right
        player.vel.x = playerSpeed;
    }

    //Jump
    if (kb.pressing('w') && hitBoxGroup.colliding(player) || kb.pressing('arrowUp') && hitBoxGroup.colliding(player)) {
        // Set sprite's velocity to the up
        player.vel.y = -1 * playerJumpHeight;
    }
}

//Enemy actions
function enemyFunction() {
    //Enemy collides with player
    if (enemyGroup.collides(player)) {
        //Lose Game
        screenPhase = "lose";
        screenPhaseSetup = true;
    }
}

function enemyStage1() {
    //Enemy balls only come from the left
    //If the enemy goes off screen it respawns
    for (i = 0; i < enemyBallSpriteArray.length; i++) {
        if (enemyBallSpriteArray[i].y >= 500) {
            enemyBallSpriteArray[i].y = random(-75, -5);
            enemyBallSpriteArray[i].vel.x = 0;
            enemyBallSpriteArray[i].vel.y = random(minBallSpeed, maxBallSpeed);
            enemyBallSpriteArray[i].x = random(25, 475);
        }
    }
}

function enemyStage2() {
    //Enemy beams come down from above
    //Beam enemies
    for (i = 0; i < enemyBeamSpriteArray.length; i++) {
        //Setting the speed
        if (enemyBeamSpriteArray[i].vel.y == 0) {
            enemyBeamSpriteArray[i].vel.y = random(minBeamSpeed, maxBeamSpeed);
        } else if (enemyBeamSpriteArray[i].vel.y >= 1 && enemyBeamSpriteArray[i].y >= 500) {
            //Deleting the beam enemy
            enemyBeamSpriteArray[i].remove();
        }
    }
}


function enemyStage3() {
    //Idea come from side??
    //If the enemy goes off screen it respawns
    //Spawn Left
    if (chosenSide == 0) {
        leftWall.color = '#a7f9ff';
        for (i = 0; i < enemyBallSpriteArray.length; i++) {
            if (enemyBallSpriteArray[i].x >= 500 || enemyBallSpriteArray[i].y >= 500) {
                enemyBallSpriteArray[i].x = random(-100, -5);
                enemyBallSpriteArray[i].vel.x = random(minBallSpeed, maxBallSpeed);
                enemyBallSpriteArray[i].vel.y = random(1, 2);
                enemyBallSpriteArray[i].y = random(30, 510);
            } else if (enemyBallSpriteArray[i].x >= 500) {
                enemyBallSpriteArray[i].remove();
            }
        }
        //Spawn Right
    } else if (chosenSide == 1) {
        rightWall.color = '#a7f9ff';
        for (i = 0; i < enemyBallSpriteArray.length; i++) {
            if (enemyBallSpriteArray[i].x <= 0 || enemyBallSpriteArray[i].y >= 500) {
                enemyBallSpriteArray[i].x = random(505, 600);
                enemyBallSpriteArray[i].vel.x = random(minBallSpeed, maxBallSpeed) * -1;
                enemyBallSpriteArray[i].vel.y = random(1, 2);
                enemyBallSpriteArray[i].y = random(30, 510);
            } else if (enemyBallSpriteArray[i].x <= 0) {
                enemyBallSpriteArray[i].remove();
            }
        }
    }
}

//Timer funciton
function timerFunction() {
    //Timer runs out
    if (secondTimer >= timeOver) {
        //Win Game
        screenPhase = "win";
        screenPhaseSetup = true;
    }
}

function scoreBallFunction() {
    //If player collects a score ball
    for (i = 0; i < scoreBallSpriteArray.length; i++) {
        if (scoreBallSpriteArray[i].overlapping(player)) {
            scoreBallsCollected = scoreBallsCollected + 1;
            //Moves scoreball
            scoreBallSpriteArray[i].x = random(50, 450);
            scoreBallSpriteArray[i].y = random(50, 450);
        }
    }
}

/******************************************************/
//  END OF APP
/******************************************************/