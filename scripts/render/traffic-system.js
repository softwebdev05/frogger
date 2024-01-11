// --------------------------------------------------------------
//
// Renders the cars in a traffic system
//
// --------------------------------------------------------------
MyGame.render.TrafficSystem = function(system, graphics, imageSrc) {
    'use strict';

    let image = new Image();
    let isReady = false;  // Can't render until the texture is loaded

    //
    // Get the texture to use for the particle system loading and ready for rendering
    image.onload = function() {
        isReady = true;
    }
    image.src = imageSrc;

    //------------------------------------------------------------------
    //
    // Render all cars
    //
    //------------------------------------------------------------------
    function render() {
        if (isReady) {
            Object.getOwnPropertyNames(system.cars).forEach( function(value) {
                let car = system.cars[value];
                graphics.drawTexture(
                        image, 
                    {   
                        x: car.center.x, 
                        y: car.center.y,
                    }, 
                    car.rotation, 
                    {   width: car.size.x, 
                        height: car.size.y,
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