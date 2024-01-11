MyGame.screens['controls'] = (function(game) {
    'use strict';

    let up_active = false;
    let down_active = false;
    let left_active = false;
    let right_active = false;

    function initialize() {

        document.getElementById('id-controls-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });

        let up = document.getElementById('up-button');
        up.onclick = function () { changeBindings('up', 'up-button'); };

        let down = document.getElementById('down-button');
        down.onclick = function () { changeBindings('down', 'down-button'); };
        
        let left = document.getElementById('left-button');
        left.onclick = function () {changeBindings('left', 'left-button');};

        let right = document.getElementById('right-button');
        right.onclick = function () {changeBindings('right', 'right-button');};
    }


    function getNewKey(event){
        if(up_active){
            document.getElementById('up-button').innerHTML = event.key;
            MyGame.bindings['up'] = event.key;
        }else if(down_active){
            document.getElementById('down-button').innerHTML = event.key;
            MyGame.bindings['down'] = event.key;
        }else if(left_active){
            document.getElementById('left-button').innerHTML = event.key;
            MyGame.bindings['left'] = event.key;
        }else if(right_active){
            document.getElementById('right-button').innerHTML = event.key;
            MyGame.bindings['right'] = event.key;
        }

        saveBindingsToStorage();

        window.removeEventListener('keydown', getNewKey);
    }


    function changeBindings(control, id){
        let button = document.getElementById(id);
        button.innerText = 'Press any Key';
        up_active = false;
        down_active = false;
        left_active = false;
        right_active = false;
        switch(control){
            case "up":
                up_active = true;
            case "down":
                down_active = true;
            case "left":
                left_active = true;
            case "right":
                right_active = true;
        }
        window.addEventListener('keydown', getNewKey);
    }


    
    function run() {
        let up = document.getElementById('up-button');
        up.innerText = MyGame.bindings['up'];

        let down = document.getElementById('down-button');
        down.innerText = MyGame.bindings['down'];

        let left = document.getElementById('left-button');
        left.innerText = MyGame.bindings['left'];

        let right = document.getElementById('right-button');
        right.innerText = MyGame.bindings['right'];
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));

