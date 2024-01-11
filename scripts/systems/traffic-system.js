// This is the traffic system use by the game code

// spec = {
//     startLoc: {
//         x: (wether cars originate from the left or the right),
//         y: (center of lane)
//     },
//     size: {
//         width: px
//         height: px
//     },
//     direction: 1 (left), -1 (right)
//     speed: px / sec,
//     numCars: int
//     canvasWidth: int px
// }


MyGame.systems.TrafficSystem = function(spec) {
    'use strict';
    let cars = {};
    let bufferSize = 0;
    let level = 1;
    let levelMultipliers = [0, 0.75, 1, 1.25, 1.4, 1.65];


    // This creates all the cars in 1 lane
    function create() {
        bufferSize = spec.size.width / 2;
        let rotation = (spec.startLoc.x == 0) ? Math.PI : 0;
        let spaceBetween = (spec.canvasWidth + spec.size.width) / spec.numCars;

        for(let i = 0; i < spec.numCars;  i++){
            let buffer = spaceBetween * i * spec.direction;
            let c = {
                center: { x: spec.startLoc.x + buffer, y: spec.startLoc.y },
                size: { x: spec.size.width, y: spec.size.height},
                direction: {x: spec.direction, y: 0},
                speed: spec.speed, // gridlengths per second
                rotation: rotation,
                level: spec.level,
            };
            cars[i] = c;
        }
    }

    function updateLevel(newLevel){
        if(newLevel > 5){
            newLevel = 5;
        }
        level = newLevel;
    }


    // Update the state of all cars. 
    function update(elapsedTime) {
        // create cars if there are no cars
        if(Object.keys(cars).length == 0){
            create();
        }

        // We work with time in seconds, elapsedTime comes in as milliseconds
        elapsedTime = elapsedTime / 1000;
        
        Object.getOwnPropertyNames(cars).forEach(function(value, index, array) {
            let car = cars[value];

            // Update its center
            car.center.x += (elapsedTime * car.speed * car.direction.x * levelMultipliers[level]);

            // If the car leaves the canvas, put it back to the start
            if (car.center.x < -bufferSize || car.center.x > spec.canvasWidth + bufferSize) {
                car.center.x = spec.startLoc.x + (-car.direction.x * bufferSize);
            }
        });
    }


    // froggerPos = {
    //     x: centerx
    //     y: centery
    //     bufferSize:
    // }
    function detectCollision(froggerPos){

        let crash = false;

        //test if frogger is on the same level as the cars
        let sameLevel = (
            spec.startLoc.y + (spec.size.height / 2) > froggerPos.y &&
            spec.startLoc.y - (spec.size.height / 2) < froggerPos.y
        );

        if(sameLevel){
            Object.getOwnPropertyNames(cars).forEach(function(value, index, array) {
                let car = cars[value];
                if(
                    car.center.x - (car.size.x / 2) < froggerPos.x + froggerPos.bufferSize / 2 &&
                    car.center.x + (car.size.x / 2) > froggerPos.x - froggerPos.bufferSize / 2
                ){
                    crash = true;
                }
            });
        }

        return crash;
    }

    // get the hitbox rows for the car (attract mode)
    function getRowIndex(car){
        let gridLength = spec.canvasWidth / 44;
        let begin = (car.center.x - car.size.x / 2) / gridLength;
        let end = (car.center.x + car.size.x / 2) / gridLength;

        let buffer = ((car.speed) / gridLength) / 2;

        // give the ai a little bit of buffer
        if(car.direction.x > 0){
            end += buffer;
            //begin -= 1;
        } else{
            begin -= buffer;
            //end += 1;
        }

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
        get cars() { return cars; }
    };

    return api;
}