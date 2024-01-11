// creates a list of water systems (logs, turtles, aligators)
function createWaterSystem(graphics, gridHeight, gridWidth, heightBuffer){
    return [
        MyGame.systems.LogSystem({
            startLoc: {
                x: 0,
                y: gridHeight*6.5,
            },
            size: {
                x: 5.6*gridWidth,
                y: gridHeight - heightBuffer,
            },
            direction: 1,
            speed: gridWidth*1.1,
            canvasWidth: graphics.canvas.width,
            numLogs: 2,
            gators: false,
            gatorSpriteTime: [400,550],
            gatorSize : {
                x: 4*gridWidth,
                y: gridHeight - heightBuffer,
            },
            level: 5,
        }, graphics),

        MyGame.systems.LogSystem({
            startLoc: {
                x: graphics.canvas.width,
                y: gridHeight*4.5,
            },
            size: {
                x: 8.5*gridWidth,
                y: gridHeight - heightBuffer,
            },
            direction: -1,
            speed: gridWidth,
            canvasWidth: graphics.canvas.width,
            numLogs: 1,
            gators: false,
            gatorSpriteTime: [400,550],
            gatorSize : {
                x: 4*gridWidth,
                y: gridHeight - heightBuffer,
            },
            level: 3,
        }, graphics),

        MyGame.systems.LogSystem({
            startLoc: {
                x: 0,
                y: gridHeight*2.5,
            },
            size: {
                x: 4*gridWidth,
                y: gridHeight - heightBuffer,
            },
            direction: 1,
            speed: gridWidth*1.25,
            canvasWidth: graphics.canvas.width * 2.5,
            numLogs: 5,
            gators: true,
            gatorSpriteTime: [400,550],
            gatorSize : {
                x: 4*gridWidth,
                y: gridHeight - heightBuffer,
            },
            level: 1,
        }, graphics),

        MyGame.systems.TurtleSystem({
            startLoc : {
                x: graphics.canvas.width,
                y: gridHeight * 3.5,
            },
            size: {
                x: gridWidth*1.2,
                y: gridHeight - heightBuffer / 2,
            },
            direction: -1,
            speed: gridWidth*2,
            canvasWidth: graphics.canvas.width,
            numGroups: 2,
            groupSize: 2,
            spriteTime: [Math.floor((Math.random() * 5000) + 5000), 500, 500, 500, 500, 1500, 100, 100, 100, 100],
            numSprites: 10,
            level: 2,
        }, graphics),

        MyGame.systems.TurtleSystem({
            startLoc : {
                x: 0,
                y: gridHeight * 5.5,
            },
            size: {
                x: gridWidth*1.2,
                y: gridHeight - heightBuffer / 2,
            },
            direction: 1,
            speed: gridWidth*2.5,
            canvasWidth: graphics.canvas.width,
            numGroups: 2,
            groupSize: 3,
            spriteTime: [Math.floor((Math.random() * 5000) + 5000), 500, 500, 500, 500, 1500, 100, 100, 100, 100],
            numSprites: 10,
            level: 4,
        }, graphics),

    ];
}

// creates a list of traffic systems
function createTrafficSystem(graphics, gridHeight, gridWidth, heightBuffer){
    return [
        MyGame.systems.TrafficSystem({
            startLoc: {
                x: graphics.canvas.width,
                y: gridHeight*12.5,
            },
            size: {
                width: gridWidth,
                height: gridHeight - heightBuffer,
            },
            direction: -1,
            speed: gridWidth * 1.5,
            canvasWidth: graphics.canvas.width,
            numCars: 3,
            level: 11,
        }, graphics),

        MyGame.systems.TrafficSystem({
            startLoc: {
                x: 0,
                y: gridHeight*11.5,
            },
            size: {
                width: 2.5*gridWidth,
                height: gridHeight - heightBuffer,
            },
            direction: 1,
            speed: gridWidth,
            canvasWidth: graphics.canvas.width,
            numCars: 2,
            level: 10,
        }, graphics),

        MyGame.systems.TrafficSystem({
            startLoc: {
                x: graphics.canvas.width,
                y: gridHeight*10.5,
            },
            size: {
                width: gridWidth,
                height: gridHeight - heightBuffer,
            },
            direction: -1,
            speed: gridWidth * 2.5,
            canvasWidth: graphics.canvas.width,
            numCars: 3,
            level: 9,
        }, graphics),

        MyGame.systems.TrafficSystem({
            startLoc: {
                x: graphics.canvas.width,
                y: gridHeight*9.5,
            },
            size: {
                width: 2*gridWidth,
                height: gridHeight - heightBuffer,
            },
            direction: -1,
            speed: gridWidth * 0.75,
            canvasWidth: graphics.canvas.width,
            numCars: 3,
            level: 8,
        }, graphics),

        MyGame.systems.TrafficSystem({
            startLoc: {
                x: 0,
                y: gridHeight*8.5,
            },
            size: {
                width: gridWidth * 4,
                height: gridHeight - heightBuffer,
            },
            direction: 1,
            speed: gridWidth * 8,
            canvasWidth: graphics.canvas.width,
            numCars: 1,
            level: 7,
        }, graphics),
    ];
}

// creates the particle system for when the frog enters the home
function createHomeParticleSystem(loc, size, graphics){
    return MyGame.systems.ParticleSystem({
            center: { x: loc.x + size.width / 2, y: loc.y + size.height / 2 },
            size: { mean: 3, stdev: 1 },
            speed: { mean: 20, stdev: 1 },
            lifetime: { mean: 0.15, stdev: 0.05 },
            rect: true,
            width: size.width,
            height: size.height,
            maxChunks: 10,
        }, graphics);
}

// creates a particle system for when frogger dies
function createDeathParticleSystem(center, size, squash, graphics){
    let speed;
    let lifetime;
    let maxChunks;

    if(squash){
        speed = { mean: 200, stdev: 25 };
        lifetime = { mean: 0.2, stdev: 0.1 };
        maxChunks = 13;
    } else{
        speed = { mean: 100, stdev: 10 };
        lifetime = { mean: 0.5, stdev: 0.15 };
        maxChunks = 20;
    }

    return MyGame.systems.ParticleSystem({
            center: center,
            size: { mean: 7, stdev: 1 },
            speed: speed,
            lifetime: lifetime,
            rect: false,
            width: size.width,
            height: size.height,
            maxChunks: maxChunks,
        }, graphics);
}