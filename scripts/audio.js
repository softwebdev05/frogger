//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
function initializeAudio() {
    'use strict';

    function loadSound(source) {
        let sound = new Audio();
        sound.src = source;
        return sound;
    }

    function loadAudio() {
        // Reference: http://www.classicgaming.cc/classics/frogger/sounds
        MyGame.sounds['music'] = loadSound('assets/audio/music.mp3');
        MyGame.sounds['hop'] = loadSound('assets/audio/hop.wav');
        MyGame.sounds['squash'] = loadSound('assets/audio/squash.wav');
        MyGame.sounds['splash'] = loadSound('assets/audio/splash.wav');
        MyGame.sounds['low-time'] = loadSound('assets/audio/low-time.wav');
        MyGame.sounds['home'] = loadSound('assets/audio/home.wav');
    }

    loadAudio();
}

function playSound(whichSound) {
    MyGame.sounds[whichSound].play();
}

function pauseSound(whichSound) {
    MyGame.sounds[whichSound].pause();
}

function stopSound(whichSound) {
    MyGame.sounds[whichSound].pause();
    MyGame.sounds[whichSound].currentTime = 0;
}

function resetSound(whichSound){
    MyGame.sounds[whichSound].currentTime = 0;
}

function setVolume(whichSound, newVolume){
    if(newVolume < 0){
        newVolume = 0;
    }
    MyGame.sounds[whichSound].volume = newVolume;
}
