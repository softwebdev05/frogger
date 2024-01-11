//------------------------------------------------------------------
//
// This is the particle system use by the game code
//
//------------------------------------------------------------------
MyGame.systems.ParticleSystem = function(spec) {
    'use strict';
    let nextName = 1;       // Unique identifier for the next particle
    let particles = {};

    //------------------------------------------------------------------
    //
    // This creates one new particle
    //
    //------------------------------------------------------------------
    function create() {

        let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let center = { 
            x: spec.center.x, 
            y: spec.center.y 
        };

        if(spec.rect){
            let edgeChoice = Math.floor(Math.random()*4);
            switch(edgeChoice){
                // up
                case 0:
                    center = {
                        x: Math.random()*(spec.width - spec.width / 5) + (spec.center.x - spec.width + spec.width / 10),
                        y: spec.center.y - spec.height + spec.height / 10,
                    }
                    break;
                // down
                case 1:
                    center = {
                        x: Math.random()*(spec.width - spec.width / 5) + (spec.center.x - spec.width + spec.width / 10),
                        y: spec.center.y - spec.height / 10,
                    }
                    break;
                // left
                case 2:
                    center = {
                        x: spec.center.x - spec.width + spec.width / 10,
                        y: Math.random()*(spec.height - spec.height / 5) + (spec.center.y - spec.height + spec.height / 10),
                    }
                    break;
                //right
                case 3:
                    center = {
                        x: spec.center.x - spec.width / 10,
                        y: Math.random()*(spec.height - spec.height / 5) + (spec.center.y - spec.height + spec.height / 10),
                    }
                    break;
            }
        }

        let p = {
                center: { x: center.x, y: center.y },
                size: { x: size, y: size},  // Making square particles
                direction: Random.nextCircleVector(),
                speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
                rotation: 0,
                lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),    // How long the particle should live, in seconds
                alive: 0    // How long the particle has been alive, in seconds
            };

        return p;
    }

    //------------------------------------------------------------------
    //
    // Update the state of all particles.  This includes removing any that have exceeded their lifetime.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        let removeMe = [];

        //
        // We work with time in seconds, elapsedTime comes in as milliseconds
        elapsedTime = elapsedTime / 1000;
        
        Object.getOwnPropertyNames(particles).forEach(function(value, index, array) {
            let particle = particles[value];
            //
            // Update how long it has been alive
            particle.alive += elapsedTime;

            //
            // Update its center
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

            //
            // Rotate proportional to its speed
            particle.rotation += particle.speed / 500;

            //
            // If the lifetime has expired, identify it for removal
            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });

        //
        // Remove all of the expired particles
        for (let particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;

        if(spec.rect || nextName < spec.maxChunks){
            // Generate some new particles
            for (let particle = 0; particle < 1; particle++) {
                //
                // Assign a unique name to each particle
                particles[nextName++] = create();
            }
        }
    }

    let api = {
        update: update,
        get particles() { return particles; }
    };

    return api;
}