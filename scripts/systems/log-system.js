// This is the log system use by the game code


// spec = {
//     startLoc: {
//         x: (wether cars originate from the left or the right),
//         y: (center of lane)
//     },
//     size: {
//         width: px
//         height: px
//     },
//     direction: 1 (right), -1 (left)
//     speed: px / sec,
//     canvasWidth: int px,
//     numLogs: int,
//     gatorSpriteTime: [],
//     gatorSize : {x: y:}
// }


MyGame.systems.LogSystem = function(spec) {
    'use strict';
    let logs = {};
    let width = document.getElementById('id-canvas').width;
    let bufferSize = 0;
    let level = 1;
    let levelMultipliers = [0, 1, 1.25, 1.5, 1.75, 2];


    // This creates all the cars in 1 lane
    function create() {
        bufferSize = spec.size.x / 2;
        let rotation = (spec.startLoc.x == 0) ? 0 : Math.PI;
        let spaceBetween = (spec.canvasWidth + spec.size.x) / (spec.numLogs);

        for(let i = 0; i < spec.numLogs;  i++){
            let buffer = (spaceBetween * i * spec.direction);
            let log = {
                center: { x: spec.startLoc.x + buffer, y: spec.startLoc.y },
                size: (i == 0 && spec.gators) ? spec.gatorSize : spec.size,
                direction: {x: spec.direction, y: 0},
                speed: spec.speed, // gridlengths per second
                rotation: rotation,
                isGator: (i == 0 && spec.gators),
                spriteIndex: 0,
                gatorSpriteTime: (i == 0 && spec.gators) ? spec.gatorSpriteTime : null,
                animationTime: 0,
                level: spec.level,
            };
            logs[i] = log;
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
        if(Object.keys(logs).length == 0){
            create();
        }

        // We work with time in seconds, elapsedTime comes in as milliseconds
        elapsedTime = elapsedTime / 1000;
        
        Object.getOwnPropertyNames(logs).forEach(function(value, index, array) {
            let log = logs[value];

            // Update its center
            log.center.x += (elapsedTime * log.speed * log.direction.x * levelMultipliers[level]);

            // If the log leaves the canvas, put it back to the start
            if (log.center.x < -bufferSize || log.center.x > spec.canvasWidth + bufferSize) {
                log.center.x = spec.startLoc.x + (-log.direction.x * bufferSize);
            }

            if(log.isGator){
                log.animationTime += elapsedTime*1000;
                // Check to see if we should update the animation frame
                if (log.animationTime >= log.gatorSpriteTime[log.spriteIndex]) {
                    // When switching sprites, keep the leftover time because it needs to be accounted for the next sprite animation frame.
                    log.animationTime -= log.gatorSpriteTime[log.spriteIndex];
                    log.spriteIndex += 1;
                    // Wrap around from the last back to the first sprite as needed
                    log.spriteIndex = log.spriteIndex % 2;
                }
            }

        });
    }


    // froggerPos = {
    //     x: centerx
    //     y: centery
    //     bufferSize:
    // }
    function detectCollision(froggerPos){

        let onLog = false;
        let eaten = false;

        //test if frogger is on the same level as the logs
        let sameLevel = (
            spec.startLoc.y + (spec.size.y / 2) > froggerPos.y &&
            spec.startLoc.y - (spec.size.y / 2) < froggerPos.y
        );

        if(sameLevel){
            Object.getOwnPropertyNames(logs).forEach(function(value, index, array) {
                let log = logs[value];
                if(
                    log.center.x - (log.size.x / 2) < froggerPos.x + froggerPos.bufferSize &&
                    log.center.x + (log.size.x / 2) > froggerPos.x - froggerPos.bufferSize
                ){
                    onLog = !log.isGator;
                    eaten = log.isGator;
                }
            });
        }

        return {
            sameLevel: sameLevel,
            onLog: onLog,
            eaten: eaten,
            newSpeed: spec.direction * spec.speed * levelMultipliers[level],
        };
    }

    // gets the log's hitbox rows for attract mode
    function getRowIndex(log){

        if(log.isGator){
            return {
                begin: 0,
                end: 0,
            }
        }

        let gridLength = width / 44;
        let begin = (log.center.x - log.size.x / 2) / gridLength;
        let end = (log.center.x + log.size.x / 2) / gridLength;

        let buffer = (0.3 * log.speed * levelMultipliers[level]) / (gridLength);

        begin += buffer;
        end -= buffer;

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
        isLog: function(){return true; },
        get logs() { return logs; },
        get level() {return spec.level},
    };

    return api;
}
