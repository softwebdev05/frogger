MyGame.screens['high-scores'] = (function(game) {
    'use strict';
    
    function initialize() {
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });
    }
    
    function run() {
        // check for data
        let highScoresScr = getStoredHighScores();
        var sortable = [];
        
        if(Object.keys(highScoresScr).length > 0){
            // if there is existing data add it to mygame.highscores
            for (var score in highScoresScr) {
                sortable.push([score, highScoresScr[score]]);
            }
            sortable.sort((a, b) => {
                return b[1] - a[1];
            });
        }
        
        // modify the highscores div
        let list = document.getElementById('scores');

        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }

        for(let i = 0; i < 5; i++){
            let newScore = document.createElement("li");
            if(i >= sortable.length){
                newScore.innerText = (i+1) + ". 00000";
                list.appendChild(newScore)
            } else{
                newScore.innerText = (i+1) + ". " + ('00000'+ sortable[i][1]).slice(-5);
                list.appendChild(newScore);
            }
            
        }

        // // modify the menu button spacing
        // let menuButtons = document.getElementsByClassName('menu');
        // for (let button = 0; button < menuButtons.length; button++) {
        //     menuButtons[button].style.paddingTop = (window.innerHeight * 0.85) / 3 + "px";
        // }
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
