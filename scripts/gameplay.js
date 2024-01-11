MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input, systems) {
    'use strict';
    const DEATH_WAIT_TIME = 2000; // 2 seconds
    const FROG_HOME_WAIT_TIME = 1500; // 1.5 seconds
    const WIN_WAIT_TIME = 5000; // 5 seconds
    const LOSE_WAIT_TIME = 3000; // 3 seconds
    const COLLISION_RENDER = false; // useful for debugging the attract mode ai

    let inputBuffer = {};
    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;
    let myKeyboard = input.Keyboard();
    let gridWidth;
    let gridHeight;
    let heightBuffer;
    let startHeight;
    let inGame;
    let justDied;
    let justLost;
    let justWon;
    let justHome;
    let lowTimePlayed = false;
    let lowAudioTime = 0;
    let deathReady = false;
    let flyPointsTime = 0;
    let aiWaitTime = 300;
    let attractLogoTime = 0;
    let attractImageReady;

    let frogger;
    let trafficSystems = [];
    let trafficRenderers = [];
    let waterSystems = [];
    let waterRenderers = [];
    let frogHomes;
    let scoreText;
    let timeText;
    let winText;
    let loseText;
    let attractModeLogo;
    let deathImage;
    let renderCollisions;

    let homeParticles;
    let renderHomeParticles;
    let deathParticles;
    let renderDeathParticles;

    let score;
    let jumpsBack;
    let timeLeft;
    let livesLeft;
    let flyText;
    let level;
    let attractMode = false;

    let waitTime;

    function handleDeath(deathType){
        if(!attractMode) pauseSound('music');
        lowTimePlayed = false;
        lowAudioTime = 0;
        if(!attractMode) livesLeft -= 1;
        if(livesLeft == 0 && !attractMode){
            waitTime = LOSE_WAIT_TIME;
            justLost = true;
        } else {
            waitTime = DEATH_WAIT_TIME;
            justDied = true;
        }

        // create a death particle system
        switch(deathType){
            case "traffic":
            case "eaten":
            case "bushes":
            case "time":
                deathParticles = createDeathParticleSystem(frogger.center, frogger.size, true, graphics);
                renderDeathParticles = renderer.ParticleSystem(deathParticles, graphics, 'assets/images/green-chunks.png');
                if(!attractMode) playSound('squash');
                break;
            case "drowned":
                deathParticles = createDeathParticleSystem(frogger.center, frogger.size, false, graphics);
                renderDeathParticles = renderer.ParticleSystem(deathParticles, graphics, 'assets/images/water-droplets.png');
                if(!attractMode) playSound('splash');
                break;
        }
    }

    function handleFrogHome(center){
        if(!attractMode && !justWon) playSound('home');

        // create a home particle system
        homeParticles = createHomeParticleSystem(center,frogger.size, graphics);
        renderHomeParticles = renderer.ParticleSystem(homeParticles, graphics, 'assets/images/sparkle.png');

        // if all the homes are filled, the player wins
        if(frogHomes.allOccupied() && !attractMode){
            score += 1050;
            scoreText.updateText(score);
            waitTime = WIN_WAIT_TIME;
            justWon = true;

        // if there are still empty homes put player back to the start
        } else{

            if(!attractMode){
                // go to next level and increase the speed of the obstacles
                level++;
                for(let i = 0; i < 5; i++){
                    trafficSystems[i].updateLevel(level);
                    waterSystems[i].updateLevel(level);
                }
            }


            score += 50;
            score += 5*Math.floor((timeLeft / 1000) * 2); // Add unusedTime to score
            scoreText.updateText(score);
            waitTime = FROG_HOME_WAIT_TIME;
            timeLeft = 30000;
            justHome = true;
            lowTimePlayed = false;
            frogger.reset();
        }
        
    }

    // check frogger's collisions
    function checkCollisions(){
        let trafficCollision;
        let waterCollision;
        let homeCollision

        let froggerPos = { 
            x: frogger.center.x, 
            y: frogger.center.y, 
            bufferSize: frogger.size.width / 4 
        };

        for(let i = 0; i < 5; i++){
            // check for traffic collisions
            trafficCollision = trafficSystems[i].detectCollision(froggerPos);
            
            if(trafficCollision){
                handleDeath("traffic");
            }

            // check for log/turtle/alligator collisions
            waterCollision = waterSystems[i].detectCollision(froggerPos);
            
            if(waterCollision.sameLevel){
                if(waterCollision.onLog || waterCollision.onTurtle){
                    frogger.changeSpeed(waterCollision.newSpeed);
                }else if(waterCollision.eaten){
                    handleDeath("eaten");
                } else{
                    handleDeath("drowned");
                }
            }
        }

        // check if frogger makes it to the end goal
        homeCollision = frogHomes.detectCollision(froggerPos);
        if(homeCollision.homeSuccess && !homeCollision.eaten){
            if(homeCollision.ateFly){
                // add points if frogger ate a fly
                score += 200;
                scoreText.updateText(score);
                flyText = objects.Text({
                    text: "200",
                    font: graphics.canvas.width / 644 + 'em arcade',
                    fillStyle: 'rgba(255, 255, 255, 1)',
                    strokeStyle: 'rgba(0, 0, 0, 1)',
                    position: {
                        x: frogger.currentLocation.x,
                        y: frogger.currentLocation.y,
                    },
                });
                flyPointsTime = 1000;
            }
            handleFrogHome(homeCollision.homeCenter);
        } else if(homeCollision.eaten){
            handleDeath("eaten");
        } else if(homeCollision.sameLevel){
            handleDeath("bushes");
        }
    }

    function updateObstacles(elapsedTime){
        // update the obstacles
        for(let i = 0; i < 5; i++){
            trafficSystems[i].update(elapsedTime);
            waterSystems[i].update(elapsedTime);
        }
    }


    function processInput(elapsedTime) {
        aiWaitTime -= elapsedTime;
        // if in attract mode, calculate the next move
        if(attractMode && aiWaitTime <= 0 && !justDied && !justLost && !justHome && !justWon){
            let nextInput = getMove(frogger, trafficSystems, waterSystems, frogHomes);
            if(COLLISION_RENDER){
                renderCollisions = nextInput.cGrid;
            }
            aiWaitTime = 200;
            switch(nextInput.direction){
                case "up":
                    frogger.moveUp(elapsedTime);
                    if(jumpsBack == 0){
                        score += 10;
                        scoreText.updateText(score);
                    } else{
                        jumpsBack--;
                    }
                    break;
                case "down":
                    frogger.moveDown(elapsedTime);
                    if(frogger.center.y > startHeight + 1 ||
                        frogger.center.y < startHeight - 1){
                            jumpsBack++;
                    }
                    break;
                case "left":
                    frogger.moveLeft(elapsedTime);
                    break;
                case "right":
                    frogger.moveRight(elapsedTime);
                    break;
            }
        }else{
            // if not in attract mode, process input as normal
            if(waitTime <= 0){
                for (input in inputBuffer) {
                    if(input == MyGame.bindings['up']){
                        if(jumpsBack == 0){
                            score += 10;
                            scoreText.updateText(score);
                        } else {
                            jumpsBack--;
                        }
                    } else if(
                        input == MyGame.bindings['down'] && 
                        (frogger.center.y > startHeight + 1 ||
                        frogger.center.y < startHeight - 1)
                    ){
                        jumpsBack++;
                    }
                    myKeyboard.update(elapsedTime);
                }
                inputBuffer = {};  
            } 
        }
    }


    function update(elapsedTime) {

        if(attractMode) attractLogoTime += elapsedTime;

        // update death particles if they exist
        if(justDied || justLost){
            deathParticles.update(elapsedTime);
        }

        //update particles if they exist
        if(justWon || justHome && waitTime > 0){
            homeParticles.update(elapsedTime);
        }

        // fade music out on win
        if(justWon && !attractMode){
            setVolume('music', waitTime / WIN_WAIT_TIME);
        }

        // update fly text time
        if(flyPointsTime > 0){
            flyPointsTime -= elapsedTime;
        }

        // if the low time sound is over, play the music again
        if(lowTimePlayed){
            lowAudioTime += elapsedTime;
            if(lowAudioTime > 1250 && !attractMode){
                playSound('music');
            }
        }

        updateObstacles(elapsedTime);
        frogHomes.update(elapsedTime);

        if(waitTime <= 0){
            if(justHome) justHome = false;
            if(justDied){
                if(!attractMode) playSound('music');
                justDied = false;
                lowTimePlayed = false;
                timeLeft = 30000;
                frogger.reset();
            } else if(justLost || justWon){
                // quit the game on a loss or a win
                quit();
            }
            frogger.update(elapsedTime);
            checkCollisions();
            timeLeft -= elapsedTime;
            // check if the player ran out of time
            if(timeLeft <= 0){
                handleDeath("time");
            } else if(timeLeft < 5000 && !lowTimePlayed){
                //play low-time sound if there are only 5 seconds left
                if(!attractMode) {
                    pauseSound('music');
                    playSound('low-time');
                }
                lowTimePlayed = true;
            }
        }
    }

    function render() {
        graphics.clear();
        graphics.drawBackground();

        for(let i = 0; i < 5; i++){
            trafficRenderers[i].render();
            waterRenderers[i].render();
        }

        renderer.Homes.render(frogHomes);
        graphics.drawTimer(timeLeft, 
            {
                tl_x: graphics.canvas.width * .7,
                tl_y: gridHeight / 2,
                width: gridWidth * 3,
                height: gridHeight / 3,
            }
        );
        graphics.drawLivesLeft(livesLeft, gridWidth*.66,
            {
                x: gridWidth / 3,
                y: gridHeight / 2,
            },
        );
        renderer.Text.render(scoreText);
        renderer.Text.render(timeText);

        if(waitTime <= 0){
            renderer.Frogger.render(frogger);
        } else if(justLost || justDied && deathReady){

            renderDeathParticles.render();

            graphics.drawTexture(
                deathImage,
                frogger.currentLocation,
                0,
                frogger.size,
            );
        }

        // render home particles
        if(justHome || justWon){
            renderHomeParticles.render();
        }

        // render "YOU WIN!"
        if(justWon){
            renderer.Text.render(winText, true);
        }
        
        // render "GAME OVER"
        if(justLost){
            renderer.Text.render(loseText, true);
        }

        // render fly points text
        if(flyPointsTime > 0){
            renderer.Text.render(flyText);
        }

        // render attract mode logo
        if(attractImageReady && attractMode && attractLogoTime % 1300 < 1000){
            MyGame.graphics.drawTexture(
                    attractModeLogo, 
                {
                    x: graphics.canvas.width / 2,
                    y: graphics.canvas.height / 2 + gridHeight / 2,
                },
                    0,
                {
                    width: graphics.canvas.width * 0.9,
                    height: gridHeight,
                },
            );
        }

        // debug: render collisions for frogger ai
        if(COLLISION_RENDER && renderCollisions){
            MyGame.graphics.drawCollisions(renderCollisions);
        }
    }

    function gameLoop(time) {
        // end game loop if tabbed out
        if(document.hidden){
            quit();
        }
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        if(waitTime > 0) waitTime -= elapsedTime;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        // reset variables back to defaults
        justDied = false;
        justLost = false;
        justWon = false;
        justHome = false;
        inGame = false;
        lowTimePlayed = false;
        lowAudioTime = 0;
        flyPointsTime = 0;
        score = 0;
        jumpsBack = 0;
        timeLeft = 30000;
        livesLeft = 5;
        waitTime = 0;
        level = 1;
        aiWaitTime = 300;

        gridHeight = graphics.canvas.height / 14;
        gridWidth = graphics.canvas.width / 11;
        startHeight = graphics.canvas.height - gridHeight / 2;
        heightBuffer = gridHeight / 5;


        frogger = objects.Frogger({
            center: { x: graphics.canvas.width / 2, y: startHeight},
            size: { width: gridWidth, height: gridHeight },
            canvasSize: {
                height: graphics.canvas.height,
                width: graphics.canvas.width,
            },
            attractMode: attractMode,
        });
        

        // create traffic systems for each lane of traffic
        trafficSystems = createTrafficSystem(graphics, gridHeight, gridWidth, heightBuffer, level);

        // create a corresponding traffic renderer for each lane of traffic
        trafficRenderers = [
            renderer.TrafficSystem(trafficSystems[0], graphics, 'assets/images/car.png'),
            renderer.TrafficSystem(trafficSystems[1], graphics, 'assets/images/truck.png'),
            renderer.TrafficSystem(trafficSystems[2], graphics, 'assets/images/fast-car.png'),
            renderer.TrafficSystem(trafficSystems[3], graphics, 'assets/images/truck.png'),
            renderer.TrafficSystem(trafficSystems[4], graphics, 'assets/images/racecars.png'),
        ];

        // create water systems for each level of water
        waterSystems = createWaterSystem(graphics, gridHeight, gridWidth, heightBuffer, level);

        // create a corresponding waterSystems renderer for each level of water
        waterRenderers = [
            renderer.LogSystem(waterSystems[0], graphics, 'assets/images/log-medium.png', 'assets/images/alligator.png'),
            renderer.LogSystem(waterSystems[1], graphics, 'assets/images/log-large.png', 'assets/images/alligator.png'),
            renderer.LogSystem(waterSystems[2], graphics, 'assets/images/log-small.png', 'assets/images/alligator.png'),
            renderer.TurtleSystem(waterSystems[3], graphics, 'assets/images/turtle.png'),
            renderer.TurtleSystem(waterSystems[4], graphics, 'assets/images/turtle.png'),
        ];


        // create home area
        frogHomes = objects.Homes({
            goalWidth: gridWidth,
            goalHeight: gridHeight * 1.5,
        });


        scoreText = objects.Text({
            text: "SCORE:" + ('00000'+ score).slice(-5),
            font: graphics.canvas.width / 495.3 + 'em arcade',
            fillStyle: 'rgba(255, 255, 255, 1)',
            strokeStyle: 'rgba(0, 0, 0, 1)',
            position: { x: gridWidth*3.5 , y: 0}
        });

        timeText = objects.Text({
            text: "TIME",
            font: graphics.canvas.width / 644 + 'em arcade',
            fillStyle: 'rgba(255, 255, 255, 1)',
            strokeStyle: 'rgba(0, 0, 0, 1)',
            position: { x: graphics.canvas.width * .78 , y: -gridHeight / 7}
        });

        deathReady = false;
        deathImage = new Image();
        deathImage.onload = function() {
            deathReady = true;
        };
        deathImage.src = 'assets/images/death.png';

        attractImageReady = false;
        attractModeLogo = new Image();
        attractModeLogo.onload = function() {
            attractImageReady = true;
        };
        attractModeLogo.src = 'assets/images/attract-mode.png';

        winText = objects.Text({
            text: "YOU WIN!",
            font: graphics.canvas.width / 322 + 'em arcade',
            fillStyle: 'rgb(150, 0, 150)',
            strokeStyle: 'rgb(150, 0, 150)',
            position: { x: graphics.canvas.width / 3.3 , y: gridHeight*6.75}
        });

        loseText = objects.Text({
            text: "GAME OVER",
            font: graphics.canvas.width / 322 + 'em arcade',
            fillStyle: 'rgb(150, 0, 150)',
            strokeStyle: 'rgb(150, 0, 150)',
            position: { x: graphics.canvas.width / 3.6, y: gridHeight*6.75}
        });

        // hide the cursor
        document.getElementById('body').classList.add('nocursor');

        if(!attractMode){
            // reset keyboard bindings
            myKeyboard.reset();

            // create keybindings
            myKeyboard.register(MyGame.bindings['up'], frogger.moveUp);
            myKeyboard.register(MyGame.bindings['down'], frogger.moveDown);
            myKeyboard.register(MyGame.bindings['left'], frogger.moveLeft);
            myKeyboard.register(MyGame.bindings['right'], frogger.moveRight);

            myKeyboard.register('Escape', function() {
                quit();
            });

            window.addEventListener('keydown', function(event) {
                inputBuffer[event.key] = event.key;
            });
        } else{
            window.addEventListener('keydown', quit);
            window.addEventListener('mousemove', quit);

        }
    }

    function quit(){

        if(!attractMode){
            stopSound('music');
        } else {
            window.removeEventListener('keydown', quit);
            window.removeEventListener('mousemove', quit);
        }
        
        inGame = false;

        //save the score
        if(justWon && !attractMode) addHighScoreToStorage(score);
        

        // un-hide the cursor
        document.getElementById('body').classList.remove('nocursor');

        // Stop the game loop by canceling the request for the next animation frame
        cancelNextRequest = true;

        // Then, return to the main menu
        game.showScreen('main-menu');
    }

    function run(runInAttractMode = false) {
        attractMode = runInAttractMode;
        if(!inGame) initialize();
        if(!attractMode) playSound('music');
        inGame = true;
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.systems));
