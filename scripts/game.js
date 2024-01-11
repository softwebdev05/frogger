// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------

MyGame.game = (function(screens) {
    'use strict';
    
    //------------------------------------------------------------------
    //
    // This function is used to change to a new active screen.
    //
    //------------------------------------------------------------------
    function showScreen(id, attractMode=false) {
        //
        // Remove the active state from all screens.  There should only be one...
        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }
        //
        // Tell the screen to start actively running
        if(attractMode && id == 'game-play'){
            screens[id].run(true);
        } else{
            screens[id].run();
        }
        
        //
        // Then, set the new screen to be active
        document.getElementById(id).classList.add('active');
    }

    //------------------------------------------------------------------
    //
    // This function performs the one-time game initialization.
    //
    //------------------------------------------------------------------
    function initialize() {
        let screen = null;

        // change canvas size based on window size (11:14 aspect ratio)
        let canvas = document.getElementById("id-canvas");
        let height = window.innerHeight * 0.90;
        let width = Math.floor((11/14)*height);
        canvas.width = width;
        canvas.height = height;

        let gameDiv = document.getElementById('game');
        gameDiv.style.width = width + "px";
        gameDiv.style.height = height + "px";

        // load audio
        initializeAudio();

        let storedBindings = getStoredBindings();
        // if there are bindigs in the storage, use them
        if(Object.keys(storedBindings).length > 0){
            // set default control values
            MyGame.bindings['up'] = storedBindings.up;
            MyGame.bindings['down'] = storedBindings.down;
            MyGame.bindings['left'] = storedBindings.left;
            MyGame.bindings['right'] = storedBindings.right;
        } else {
            // set default control values
            MyGame.bindings['up'] = 'ArrowUp';
            MyGame.bindings['down'] = 'ArrowDown';
            MyGame.bindings['left'] = 'ArrowLeft';
            MyGame.bindings['right'] = 'ArrowRight';
        }


        //
        // Go through each of the screens and tell them to initialize
        for (screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }
        
        //
        // Make the main-menu screen the active one
        showScreen('main-menu');
    }
    
    return {
        initialize : initialize,
        showScreen : showScreen
    };
}(MyGame.screens));
