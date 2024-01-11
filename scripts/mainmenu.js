MyGame.screens['main-menu'] = (function(game) {
    'use strict';

    const ATTRACT_MODE_TIME = 10000; // 10s

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;
    let elapsedTime = 0;

    
    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() {
                cancelNextRequest = true;
                elapsedTime = 0;
                game.showScreen('game-play'); 
            });
        
        document.getElementById('id-high-scores').addEventListener(
            'click',
            function() { 
                cancelNextRequest = true;
                elapsedTime = 0;
                game.showScreen('high-scores'); 
            });
        
        document.getElementById('id-controls').addEventListener(
            'click',
            function() { 
                cancelNextRequest = true;
                elapsedTime = 0;
                game.showScreen('controls'); 
            });
        
        document.getElementById('id-about').addEventListener(
            'click',
            function() { 
                cancelNextRequest = true;
                elapsedTime = 0;
                game.showScreen('about'); 
            });
        
        window.addEventListener('keydown', function(event) {
            elapsedTime = 0;
        });
        window.addEventListener('mousemove', function(event) {
            elapsedTime = 0;
        });
    }

    // time loop to track the time to the attract mode
    function timeLoop(time) {
        elapsedTime = elapsedTime + time - lastTimeStamp;
        lastTimeStamp = time;

        if(elapsedTime > ATTRACT_MODE_TIME){
            cancelNextRequest = true;
            elapsedTime = 0;
            game.showScreen('game-play', true);
        }

        if (!cancelNextRequest) {
            requestAnimationFrame(timeLoop);
        }
    }
    
    function run() {
        stopSound('music');
        setVolume('music', 1);
        // un-hide the cursor
        document.getElementById('body').classList.remove('nocursor');

        // modify the menu button spacing
        let menuButtons = document.getElementsByClassName('menu');
        for (let button = 0; button < menuButtons.length; button++) {
            menuButtons[button].style.paddingTop = (window.innerHeight * 0.85) / 10 + "px";
        }

        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(timeLoop);
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
