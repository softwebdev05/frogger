MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    let flowerbedReady = false;
    let flowerbed = new Image();
    flowerbed.onload = function() {
        flowerbedReady = true;
    };
    flowerbed.src = 'assets/images/flowers.png';

    let waterReady = false;
    let water = new Image();
    water.onload = function() {
        waterReady = true;
    };
    water.src = 'assets/images/water.png';

    let roadReady = false;
    let road = new Image();
    road.onload = function() {
        roadReady = true;
    };
    road.src = 'assets/images/road.png';

    let goalReady = false;
    let goal = new Image();
    goal.onload = function() {
        goalReady = true;
    };
    goal.src = 'assets/images/goal.png';

    let lifeReady = false;
    let life = new Image();
    life.onload = function() {
        lifeReady = true;
    };
    life.src = 'assets/images/life.png';


    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }


    // draws the background images
    function drawBackground(){
        context.save();

        let tileSize = (canvas.width / 11 + canvas.height / 14) / 2;

        // draw the goal
        if(goalReady){
            context.drawImage(
                goal,
                0,
                tileSize,
                canvas.width,
                tileSize,
            );
        }

        // draw the water
        if(waterReady){
            context.drawImage(
                water,
                0,
                tileSize*2 - 1,
                canvas.width,
                tileSize*5,
            );
        }

        // draw the flowers
        if(flowerbedReady){
            // rest area
            context.drawImage(
                flowerbed,
                0,
                tileSize*7,
                canvas.width,
                tileSize,
            );
            // beginning
            context.drawImage(
                flowerbed,
                0,
                tileSize*13,
                canvas.width,
                tileSize,
            );
        }
        
        // draw the road
        if(roadReady){
            context.drawImage(
                road,
                0,
                tileSize*8,
                canvas.width,
                tileSize*5,
            );
        }

        context.restore();
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }


    function drawSubTexture(image, index, subTextureWidth, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        // Pick the selected sprite from the sprite sheet to render
        //console.log(index, subTextureWidth, center, rotation, size);
        context.drawImage(
            image,
            subTextureWidth * index, 0,      // Which sub-texture to pick out
            subTextureWidth, image.height,   // The size of the sub-texture
            center.x - size.width / 2,           // Where to draw the sub-texture
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }


    function drawText(spec, background=false) {
        context.save();

        context.font = spec.font;
        context.textBaseline = 'top';

        if(background){
            context.beginPath();
            let width = context.measureText(spec.text).width;
            context.fillStyle = "black";
            context.strokeStyle = "black";
            context.rect(spec.position.x, spec.position.y, width, canvas.height / 10);
            context.fill();
            context.stroke();
        }

        context.translate(spec.position.x, spec.position.y);
        context.rotate(spec.rotation);
        context.translate(-spec.position.x, -spec.position.y);
        context.strokeStyle = spec.strokeStyle;
        context.fillStyle = spec.fillStyle;
        context.fillText(spec.text, spec.position.x, spec.position.y);
        context.strokeText(spec.text, spec.position.x, spec.position.y);

        context.restore();
    }

    function drawTimer(timeLeft, loc){

        let timeLeftWidth = (timeLeft / 30000) * loc.width;
        let timeLeftLoc_x = loc.tl_x + (loc.width - timeLeftWidth);

        context.save();
        context.beginPath();
        context.lineWidth = loc.height / 7;
        context.strokeStyle = "white";
        context.rect(loc.tl_x, loc.tl_y, loc.width, loc.height);
        context.stroke();

        context.beginPath();
        context.lineWidth = 1;
        context.rect(timeLeftLoc_x, loc.tl_y, timeLeftWidth, loc.height);
        context.fillStyle = "white";
        context.fill();
        context.stroke();

        context.restore();
    }

    function drawLivesLeft(livesLeft, spacing, startLoc){
        if(lifeReady){
            for(let i = 0; i < livesLeft; i++){
                drawTexture(
                    life,
                    {
                        x: startLoc.x + i*spacing,
                        y: startLoc.y,
                    },
                    0,
                    {
                        width: startLoc.y,
                        height: startLoc.y,
                    },
                );
            }
        }
    }

    function drawCollisions(collisionGrid){
        let gridWidth = canvas.width / 44;
        let gridHeight = canvas.height / 14;
        context.save();    
        context.globalAlpha = 0.5;

        for(let i = 1; i < 14; i++){
            for(let j = 0; j < 44; j++){
                context.beginPath();
                context.rect(j*gridWidth, i*gridHeight, gridWidth, gridHeight);
                context.fillStyle = (collisionGrid[i-1][j]) ? "green" : "red";
                context.fill();
                context.stroke();
            }
        }
        context.globalAlpha = 1.0;
        context.restore();
        
    }


    let api = {
        get canvas() { return canvas; },
        get context() {return context; },
        clear: clear,
        drawTexture: drawTexture,
        drawText: drawText,
        drawBackground: drawBackground,
        drawSubTexture: drawSubTexture,
        drawTimer: drawTimer,
        drawLivesLeft: drawLivesLeft,
        drawCollisions: drawCollisions,
    };

    return api;
}());
