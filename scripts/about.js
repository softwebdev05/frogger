MyGame.screens['about'] = (function(game) {
    'use strict';
    
    function initialize() {
        document.getElementById('id-about-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });
    }
    
    function run() {
        // // modify the menu button spacing
        // let menuButtons = document.getElementsByClassName('menu');
        // for (let button = 0; button < menuButtons.length; button++) {
        //     menuButtons[button].style.paddingTop = (window.innerHeight * 0.85) / 2.15 + "px";
        // }
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
