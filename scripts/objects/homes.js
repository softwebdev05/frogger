MyGame.objects.Homes = function(spec) {
    'use strict';
    let homes = {};

    let flySpawned = false;
    let flySpawnRate = Math.floor((Math.random() * 5000) + 5000); // 5-10s spawn rate
    let flyDuration = Math.floor((Math.random() * 10000) + 5000); // 5-15s spawn durations
    let flyTime = 0;
    let flyIndex;

    let gatorSpawned = false;
    let gatorSpawnRate = 5000; // 3-15s spawn rate
    let gatorDuration = 5000; // 3s spawn durations
    let gatorTime = 0;
    let gatorIndex;

    let frogHomeReady = false;
    let frogHomeImage = new Image();
    frogHomeImage.onload = function() {
        frogHomeReady = true;
    };
    frogHomeImage.src = 'assets/images/frogger-home.png';

    let flyReady = false;
    let flyImage = new Image();
    flyImage.onload = function() {
        flyReady = true;
    };
    flyImage.src = 'assets/images/fly.png';

    let gatorSubImageWidth = 0;
    let gatorReady = false;
    let gatorImage = new Image();
    gatorImage.onload = function() {
        gatorReady = true;
        gatorSubImageWidth = gatorImage.width / 2;
    };
    gatorImage.src = 'assets/images/gator-home.png';

    function createHomes(){
        for(let i = 0; i < 5; i++){
            homes[i] = {
                center: {
                    x: spec.goalWidth*1.5 + 2*spec.goalWidth*i,
                    y: spec.goalHeight,
                },
                size: {
                    width: spec.goalWidth*0.7,
                    height: spec.goalHeight/2,
                },
                hasFly: false,
                hasGator: false,
                gatorIndex: 0,
                gatorTime: 0,
                gatorSpriteTime: [350, 350],
                occupied: false,
            };
        }
    }

    function allOccupied(){
        for(let i = 0; i < 5; i++){
            if(!homes[i].occupied){
                return false;
            }
        }
        return true;
    }

    function flyExists(){
        for(let i = 0; i < 5; i++){
            if(homes[i].hasFly){
                return true;
            }
        }
        return false;
    }

    // froggerPos = {
    //     x: centerx
    //     y: centery
    //     bufferSize:
    // }
    function detectCollision(froggerPos){

        let homeSuccess = false;
        let ateFly = false;
        let eaten = false;
        let homeCenter = {};

        //test if frogger is on the same level as the goal
        let sameLevel = (
            spec.goalHeight + (spec.goalHeight / 2) > froggerPos.y &&
            spec.goalHeight - (spec.goalHeight / 2) < froggerPos.y
        );

        if(sameLevel){
            Object.getOwnPropertyNames(homes).forEach(function(value, index, array) {
                let home = homes[value];
                if(
                    home.center.x - (spec.goalWidth / 2) < froggerPos.x + froggerPos.bufferSize / 2 &&
                    home.center.x + (spec.goalHeight / 2) > froggerPos.x - froggerPos.bufferSize  / 2
                ){
                    if(home.hasGator){
                        eaten = true;
                    } else {
                        homeSuccess = true;
                        homeCenter = home.center,
                        homes[value].occupied = true;
                        ateFly = home.hasFly;
                        homes[value].hasFly = false;
                        flySpawned = false
                    }
                }
            });
        }

        return {
            homeSuccess: homeSuccess,
            homeCenter: homeCenter,
            sameLevel: sameLevel,
            ateFly: ateFly,
            eaten: eaten,
        };
    }

    // update times for the gator/fly spawners in the homes
    function update(elapsedTime){
        flyTime += elapsedTime;
        gatorTime += elapsedTime;

        if(!flySpawned && flyTime > flySpawnRate){
            let tries = 0;
            while(!flySpawned && tries < 3){
                let randHome = Math.floor((Math.random() * 5));
                if(!homes[randHome].occupied && 
                    !homes[randHome].hasGator && 
                    !homes[randHome].hasFly &&
                    !flyExists()
                ){
                    flyIndex = randHome;
                    homes[randHome].hasFly = true;
                    flySpawned = true;
                }
                tries++;
            }
            flyTime = 0;

        } else if(flySpawned && flyTime > flyDuration){
            homes[flyIndex].hasFly = false;
            flySpawned = false;
            flyTime = 0;
        }

        if(!gatorSpawned && gatorTime > gatorSpawnRate){
            let randHome = Math.floor((Math.random() * 5));
            let rand = Math.random();
            if(!homes[randHome].occupied && 
                !homes[randHome].hasGator && 
                !homes[randHome].hasFly &&
                rand < 0.33
            ){
                gatorIndex = randHome;
                homes[randHome].hasGator = true;
                gatorSpawned = true;
            }
            gatorTime = 0;

        } else if(gatorSpawned){
            if(gatorTime > gatorDuration){
                homes[gatorIndex].hasGator = false;
                gatorSpawned = false;
                gatorTime = 0;
            }

            let home = homes[gatorIndex];
            homes[gatorIndex].gatorTime += elapsedTime;
            if(home.gatorTime >= home.gatorSpriteTime[home.gatorIndex]){
                homes[gatorIndex].gatorTime -= home.gatorSpriteTime[home.gatorIndex];
                homes[gatorIndex].gatorIndex++;
                homes[gatorIndex].gatorIndex = homes[gatorIndex].gatorIndex % 2;
            }
        }
    }

    createHomes();

    let api = {
        detectCollision: detectCollision,
        update: update,
        allOccupied: allOccupied,
        get homes() {return homes;},
        get frogHomeReady() {return frogHomeReady;},
        get frogHomeImage() {return frogHomeImage;},
        get gatorReady() {return gatorReady;},
        get flyReady() {return flyReady; },
        get flyImage() {return flyImage; },
        get gatorImage() {return gatorImage; },
        get gatorSubImageWidth() {return gatorSubImageWidth; },
        get gatorSize(){
            return {
                width: spec.goalWidth,
                height: spec.goalHeight / 2
            }
        }
    };

    return api;
}
