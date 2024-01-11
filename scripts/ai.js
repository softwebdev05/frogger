const GRID_HEIGHT = 13;
const GRID_WIDTH = 44;
const WIDTH_SCALE = 4;

function getCollisionGrid(trafficSystems, waterSystems, frogHomes){
    // initialize collision grid
    let collisionGrid = Array.from({ length: GRID_HEIGHT }, () => 
        Array.from({ length: GRID_WIDTH }, () => true)
    );

    for(let i = 0; i < 5; i++){

        // add cars to the collision grid
        let cars = trafficSystems[i].cars;
        Object.getOwnPropertyNames(cars).forEach(function(value, index, array) {
            let car = cars[value];
            let rows = trafficSystems[i].getRowIndex(car);

            for(let j = rows.begin; j <= rows.end; j++){
                if(j < GRID_WIDTH && j >= 0){
                    collisionGrid[car.level][j] = false;
                }
            }
        });

        collisionGrid[waterSystems[i].level] = Array.from({ length: GRID_WIDTH }, () => false);
        // add logs to the collision grid
        if(waterSystems[i].isLog()){
            let logs = waterSystems[i].logs;
            Object.getOwnPropertyNames(logs).forEach(function(value, index, array) {
                let log = logs[value];
                let rows = waterSystems[i].getRowIndex(log);
                for(let j = rows.begin; j <= rows.end; j++){
                    if(j < GRID_WIDTH && j >= 0){
                        collisionGrid[log.level][j] = true;
                    }
                }
            });


        } else { // add turtles to the collision grid
            let turtles = waterSystems[i].turtles;
            Object.getOwnPropertyNames(turtles).forEach(function(value, index, array) {
                let turtle = turtles[value];

                if([3, 4, 5].indexOf(turtle.spriteIndex) < 0){
                    let rows = waterSystems[i].getRowIndex(turtle);

                    for(let j = rows.begin; j <= rows.end; j++){
                        if(j < GRID_WIDTH && j >= 0){
                            collisionGrid[turtle.level][j] = true;
                        }
                    }
                }
            });
        }
    }

    // add safe areas to the grid
    for(let j =  0; j < GRID_WIDTH; j++){
        collisionGrid[0][j] = false;
        collisionGrid[6][j] = true;
        collisionGrid[12][j] = true;
    }

    // add frog homes to the grid
    for(let i = 0; i < 5; i++){
        if(!frogHomes.homes[i].occupied && !frogHomes.homes[i].hasGator){
            for(let j = 1; j <= 4; j++){
                collisionGrid[0][((i+1)*8) - j] = true;
            }
        }
    }

    return collisionGrid;
}

function getMove(frogger, trafficSystems, waterSystems, frogHomes){
    let collisionGrid = getCollisionGrid(trafficSystems, waterSystems, frogHomes);
    let froggerIndex = frogger.getIndex();

    let upSafe = 
        collisionGrid[froggerIndex.y - 1][froggerIndex.x] &&
        (collisionGrid[froggerIndex.y - 1][froggerIndex.x + 1] ||
        collisionGrid[froggerIndex.y - 1][froggerIndex.x - 1]);

    let inDanger = 
        !upSafe &&
        (!collisionGrid[froggerIndex.y][froggerIndex.x + WIDTH_SCALE] ||
        !collisionGrid[froggerIndex.y][froggerIndex.x - WIDTH_SCALE]);


    if(upSafe){
        return {direction: "up", cGrid: collisionGrid};
    } else if(!inDanger){
        return {direction: "", cGrid: collisionGrid};
    } else if(collisionGrid[froggerIndex.y][froggerIndex.x + WIDTH_SCALE]){
        return {direction: "right", cGrid: collisionGrid};
    } else if(collisionGrid[froggerIndex.y][froggerIndex.x - WIDTH_SCALE]){
        return {direction: "left", cGrid: collisionGrid};
    } else if(collisionGrid[froggerIndex.y + 1][froggerIndex.x] && inDanger){
        return {direction: "down", cGrid: collisionGrid};
    }  else{
        return {direction: "", cGrid: collisionGrid};
    }
} 