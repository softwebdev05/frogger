// This is the turtle system use by the game code

MyGame.systems.TurtleSystem = function(spec) {
    'use strict';
    let turtles = {};
    let bufferSize = 0;
    let nextTurtle = 0;
    let level = 1;
    let levelMultipliers = [0, 1, 1.25, 1.5, 1.75, 2];

    // This creates all the cars in 1 lane
    function create() {
        bufferSize = spec.size.x / 2;
        let rotation = (spec.startLoc.x == 0) ? Math.PI : 0;
        let spaceBetween = (spec.canvasWidth + spec.size.x) / (spec.numGroups);

        for(let i = 0; i < spec.numGroups;  i++){
            let groupBuffer = spaceBetween * i;
            for(let j = 0; j < spec.groupSize; j++){
                    let spacing = (j * spec.size.x + groupBuffer) * spec.direction;
                    let turtle = {
                        center: { x: spec.startLoc.x + spacing, y: spec.startLoc.y },
                        size: spec.size,
                        direction: {x: spec.direction, y: 0},
                        speed: spec.speed, // gridlengths per second
                        rotation: rotation,
                        spriteIndex: 0,
                        spriteTime: spec.spriteTime,
                        animationTime: i*spec.spriteTime[0],
                        subAnimationTime: 0,
                        subAnimationSpriteTime: [200, 500],
                        subAnimationIndex: 0,
                        level: spec.level,
                    };
                    turtles[nextTurtle++] = turtle;
            }
        }
    }

    function updateLevel(newLevel){
        if(newLevel > 5){
            newLevel = 5;
        }
        level = newLevel;
    }


    // Update the state of all logs. 
    function update(elapsedTime) {
        // create cars if there are no cars
        if(Object.keys(turtles).length == 0){
            create();
        }

        // We work with time in seconds, elapsedTime comes in as milliseconds
        elapsedTime = elapsedTime / 1000;
        
        Object.getOwnPropertyNames(turtles).forEach(function(value, index, array) {
            let turtle = turtles[value];

            // Update its center
            turtle.center.x += (elapsedTime * turtle.speed * spec.direction * levelMultipliers[level]);

            // If the log leaves the canvas, put it back to the start
            if (turtle.center.x < -bufferSize || turtle.center.x > spec.canvasWidth + bufferSize) {
                turtle.center.x = spec.startLoc.x + (-spec.direction * bufferSize);
            }

            turtle.animationTime += elapsedTime*1000;

            if(turtle.spriteIndex == 0){
                turtle.subAnimationTime += elapsedTime*1000;
                if(turtle.subAnimationTime >= turtle.subAnimationSpriteTime[turtle.subAnimationIndex]){
                    turtle.subAnimationTime -= turtle.subAnimationSpriteTime[turtle.subAnimationIndex];
                    turtle.subAnimationIndex++;
                    turtle.subAnimationIndex = turtle.subAnimationIndex % 2;
                }
            }
            
            // Check to see if we should update the animation frame
            if (turtle.animationTime >= turtle.spriteTime[turtle.spriteIndex]) {
                // When switching sprites, keep the leftover time because it needs to be accounted for the next sprite animation frame.
                turtle.animationTime -= turtle.spriteTime[turtle.spriteIndex];
                turtle.spriteIndex += 1;
                // Wrap around from the last back to the first sprite as needed
                turtle.spriteIndex = turtle.spriteIndex % spec.numSprites;
            }

        });
    }

    // froggerPos = {
    //     x: centerx
    //     y: centery
    //     bufferSize:
    // }
    function detectCollision(froggerPos){

        let onTurtle = false;

        //test if frogger is on the same level as the turtles
        let sameLevel = (
            spec.startLoc.y + (spec.size.y / 2) > froggerPos.y &&
            spec.startLoc.y - (spec.size.y / 2) < froggerPos.y
        );

        if(sameLevel){
            Object.getOwnPropertyNames(turtles).forEach(function(value, index, array) {
                let turtle = turtles[value];
                if(
                    turtle.center.x - (turtle.size.x / 2) < froggerPos.x &&
                    turtle.center.x + (turtle.size.x / 2) > froggerPos.x 
                ){
                    if(!onTurtle){
                        onTurtle = turtle.spriteIndex != 5;
                    }
                }
            });
        }


        return {
            sameLevel: sameLevel,
            onTurtle: onTurtle,
            newSpeed: spec.direction * spec.speed * levelMultipliers[level],
        };
    }

    // gets the turtle's row indeces for attract mode
    function getRowIndex(turtle){
        let gridLength = spec.canvasWidth / 44;
        let begin = (turtle.center.x - turtle.size.x / 2) / gridLength;
        let end = (turtle.center.x + turtle.size.x / 2) / gridLength;

        let buffer = 1;

        // give the ai a little bit of buffer
        end -= buffer;
        begin += buffer;

        return {
            begin: Math.round(begin),
            end: Math.round(end),
        }
    }

    let api = {
        update: update,
        detectCollision: detectCollision,
        updateLevel: updateLevel,
        getRowIndex: getRowIndex,
        isLog: function(){return false; },
        get turtles() { return turtles; },
        get level() {return spec.level},
    };

    return api;
}


