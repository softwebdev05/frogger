const GRID_HEIGHT = 13;
const GRID_WIDTH = 44;
const WIDTH_SCALE = 4;
let currentGoal = {x: 0, y: 0};

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

                if([4, 5].indexOf(turtle.spriteIndex) < 0){
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

    if(!frogHomes.allOccupied()){
        // add frog homes to the grid
        for(let i = 0; i < 5; i++){
            if(!frogHomes.homes[i].occupied && !frogHomes.homes[i].hasGator){
                for(let j = 1; j <= 4; j++){
                    if(j == 2) currentGoal = {x: (((i+1)*8) - j), y: 0};
                    collisionGrid[0][((i+1)*8) - j] = true;
                }
                break;
            }
        }   
    } else { // if the frog homes are all occupied make the middle home the goal
        for(let i = 0; i < 4; i++){
            if(i == 2) currentGoal = {x: i+20, y: 0};
            collisionGrid[0][i+20] = true;
        }
    }


    return collisionGrid;
}

function getMove(frogger, trafficSystems, waterSystems, frogHomes){
    let collisionGrid = getCollisionGrid(trafficSystems, waterSystems, frogHomes);
    let froggerLoc = frogger.getIndex()
    let nextMove = findPath(froggerLoc, collisionGrid);

    // these checks help frogger make a decision if he's in danger or can't find an adequate path
    let upSafe = 
        collisionGrid[froggerLoc.y - 1][froggerLoc.x] &&
        collisionGrid[froggerLoc.y - 1][froggerLoc.x + 1] &&
        collisionGrid[froggerLoc.y - 1][froggerLoc.x - 1];

    let downSafe = 
        froggerLoc.y < 12 &&
        collisionGrid[froggerLoc.y + 1][froggerLoc.x] &&
        (collisionGrid[froggerLoc.y + 1][froggerLoc.x + 1] ||
        collisionGrid[froggerLoc.y + 1][froggerLoc.x - 1]);

    let rightSafe = 
        froggerLoc.x < 43 &&
        collisionGrid[froggerLoc.y][froggerLoc.x + WIDTH_SCALE] &&
        (collisionGrid[froggerLoc.y][froggerLoc.x + WIDTH_SCALE/2] ||
        collisionGrid[froggerLoc.y][froggerLoc.x + WIDTH_SCALE + 1]);

    let leftSafe = 
        froggerLoc.x > 0 &&
        collisionGrid[froggerLoc.y][froggerLoc.x - WIDTH_SCALE] &&
        (collisionGrid[froggerLoc.y][froggerLoc.x - WIDTH_SCALE/2] ||
        collisionGrid[froggerLoc.y][froggerLoc.x - WIDTH_SCALE + 1]);

    if(!collisionGrid[froggerLoc.y][froggerLoc.x] && (!leftSafe || !rightSafe)){
        if(upSafe){
            return {direction: "up", cGrid: collisionGrid};
        } else if(leftSafe || froggerLoc.x == 43){
            return {direction: "left", cGrid: collisionGrid};
        } else if(rightSafe || froggerLoc.x == 0){
            return {direction: "right", cGrid: collisionGrid};
        } else if(downSafe){
            return {direction: "down", cGrid: collisionGrid};
        }
    }

    if(nextMove.y < froggerLoc.y || underGoal(froggerLoc)){
        return {direction: "up", cGrid: collisionGrid};
    }

    if(nextMove.x < froggerLoc.x){
        return {direction: "left", cGrid: collisionGrid};
    }

    if(nextMove.x > froggerLoc.x){
        return {direction: "right", cGrid: collisionGrid};
    }

    if(nextMove.y > froggerLoc.y){
        return {direction: "down", cGrid: collisionGrid};
    }
    

    return {direction: "", cGrid: collisionGrid};
}


function findPath(froggerLoc, collisionGrid){
    let queue = [];
    queue.push(froggerLoc);
    let visited = new Set();
    visited.add(JSON.stringify(froggerLoc));
    let cameFrom = Array.from({ length: GRID_HEIGHT }, () => 
        Array.from({ length: GRID_WIDTH }, () => null)
    );

    while(queue.length != 0){
        let t = queue.shift();
        for (let [key, value] of Object.entries(getPossibleMoves(t))) {
            let strigified = JSON.stringify(value);
            if(checkBounds(value) && !visited.has(strigified) && collisionGrid[value.y][value.x] == true){
                queue.push(value);
                visited.add(strigified);
                cameFrom[value.y][value.x] = {
                    x: t.x,
                    y: t.y,
                }
            }
        }
    }

    let stack = [];
    let point = cameFrom[currentGoal.y][currentGoal.x];
    
    // if no current path to the goal exists, find lowest manhattan point
    if (point == null){
        let lowest = Number.MAX_VALUE;
        for(let i = 0; i < GRID_HEIGHT; i++){
            for(let j = 0; j < GRID_WIDTH; j++){
                let manhattan_dist = Math.abs(currentGoal.x - j) + Math.abs(currentGoal.y - i);
                if(manhattan_dist < lowest && cameFrom[i][j] != null){
                    point = cameFrom[i][j];
                    lowest = manhattan_dist;
                }
                
            }
        }
    }

    if(point == null || cameFrom[point.y][point.x] == null){
        return {
            x: froggerLoc.x,
            y: froggerLoc.y,
        };
    }

    while(cameFrom[point.y][point.x] != null){
        stack.push(point);
        point = cameFrom[point.y][point.x];
    }

    return stack[stack.length - 1];
}

function getPossibleMoves(loc){
    return {
        up: {
            x: loc.x,
            y: loc.y - 1,
        },
        down: {
            x: loc.x,
            y: loc.y + 1,
        },
        left: {
            x: loc.x - WIDTH_SCALE,
            y: loc.y,
        },
        right: {
            x: loc.x + WIDTH_SCALE,
            y: loc.y,
        },
    };
}

function checkBounds(loc){
    return loc.x >= 0 && loc.x < GRID_WIDTH && loc.y >= 0 && loc.y < GRID_HEIGHT;
}

function underGoal(loc){
    return loc.y == 1  && (loc.x >= currentGoal.x - 2 && loc.x <= currentGoal.x + 2);
}