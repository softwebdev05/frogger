// --------------------------------------------------------------
//
// Creates a Text object, with functions for managing state.
//
// spec = {
//    text: ,
//    font: ,
//    fillStyle: ,
//    strokeStyle: ,
//    position: { x: , y: }
// }
//
// --------------------------------------------------------------
MyGame.objects.Text = function(spec) {
    'use strict';

    let rotation = 0;
    let text = spec.text;

    function updateText(newScore){
        text = "SCORE:" + ('00000'+ newScore).slice(-5);
    }

    let api = {
        updateText: updateText,
        get rotation() { return rotation; },
        get position() { return spec.position; },
        get text() { return text; },
        get font() { return spec.font; },
        get fillStyle() { return spec.fillStyle; },
        get strokeStyle() { return spec.strokeStyle; }
    };

    return api;
}
