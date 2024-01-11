// --------------------------------------------------------------
//
// Renders the logs in a log system
//
// --------------------------------------------------------------
MyGame.render.LogSystem = function(system, graphics, logImage, gatorImage) {
    'use strict';

    let logImg = new Image();
    let logReady = false;  
    logImg.onload = function() {
        logReady = true;
    }
    logImg.src = logImage;

    let subTextureWidth = 0;
    let gator = new Image();
    let gatorReady = false;  
    gator.onload = function() {
        gatorReady = true;
        subTextureWidth = gator.width / 2;
    }
    gator.src = gatorImage;

    //------------------------------------------------------------------
    //
    // Render all logs
    //
    //------------------------------------------------------------------
    function render() {
        if (logReady && gatorReady) {
            Object.getOwnPropertyNames(system.logs).forEach( function(value) {
                let log = system.logs[value];
                if(!log.isGator){
                    graphics.drawTexture(
                        logImg, 
                        {   
                            x: log.center.x, 
                            y: log.center.y,
                        }, 
                        log.rotation, 
                        {   width: log.size.x, 
                            height: log.size.y,
                        },
                    );
                } else {
                    graphics.drawSubTexture(
                        gator, 
                        log.spriteIndex, 
                        subTextureWidth,
                        {   
                            x: log.center.x, 
                            y: log.center.y,
                        }, 
                        log.rotation, 
                        {   width: log.size.x, 
                            height: log.size.y,
                        },
                    );
                }
                
            });
        }
    }

    let api = {
        render: render,
    };

    return api;
};