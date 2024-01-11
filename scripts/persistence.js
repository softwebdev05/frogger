function addHighScoreToStorage(score) {
    'use strict';
    let highScores = getStoredHighScores();
    let len = Object.keys(highScores).length;
    highScores[len] = score;
    localStorage['MyGame.highScores'] = JSON.stringify(highScores);
}

function getStoredHighScores(){
    'use strict';
    let scores = {};
    let previousScores = localStorage.getItem('MyGame.highScores');
    if (previousScores !== null) {
        scores = JSON.parse(previousScores);
    }
    return scores;
}

// adds the current bindings to localstorage
function saveBindingsToStorage() {
    localStorage['MyGame.bindings'] = JSON.stringify(MyGame.bindings);
}

// gets the current bindings (if any) from localstorage
function getStoredBindings(){
    let currentBindings = {};
    let previousBindings = localStorage.getItem('MyGame.bindings');
    if (previousBindings !== null) {
        currentBindings = JSON.parse(previousBindings);
    }
    return currentBindings;
}

function clearLocalStorage(){
    localStorage.clear();
}