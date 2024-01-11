// --------------------------------------------------------------
//
// Renders the turtles in a turtle system
//
// --------------------------------------------------------------
MyGame.render.TurtleSystem = function(system, graphics, turtleImageSrc) {
    'use strict';

    let subTextureWidth = 0;
    let turtleImg = new Image();
    let turtleReady = false;  
    turtleImg.onload = function() {
        turtleReady = true;
        subTextureWidth = turtleImg.width / 10;
    }
    turtleImg.src = turtleImageSrc;

    //------------------------------------------------------------------
    //
    // Render all logs
    //
    //------------------------------------------------------------------
    function render() {
        if (turtleReady) {
            Object.getOwnPropertyNames(system.turtles).forEach( function(value) {
                let turtle = system.turtles[value];

                graphics.drawSubTexture(
                    turtleImg, 
                    (turtle.spriteIndex == 0) ? turtle.subAnimationIndex: turtle.spriteIndex, 
                    subTextureWidth,
                    {   
                        x: turtle.center.x, 
                        y: turtle.center.y,
                    }, 
                    turtle.rotation, 
                    {   width: turtle.size.x, 
                        height: turtle.size.y,
                    },
                );
                
            });
        }
    }

    let api = {
        render: render,
    };

    return api;
};