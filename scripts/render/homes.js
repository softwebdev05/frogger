MyGame.render.Homes = (function(graphics) {
    'use strict';

    function render(spec) {
        if (spec.frogHomeReady && spec.flyReady && spec.gatorReady) {
            Object.getOwnPropertyNames(spec.homes).forEach(function(value, index, array) {
                let home = spec.homes[value];
                if(home.occupied){
                    graphics.drawTexture(spec.frogHomeImage, home.center, 0, home.size);
                } else if(home.hasFly){
                    graphics.drawTexture(spec.flyImage, home.center, Math.PI/2, 
                        {
                            width: home.size.width / 2,
                            height: home.size.height / 2,
                        }
                    );
                } else if(home.hasGator){
                    graphics.drawSubTexture(
                        spec.gatorImage,
                        home.gatorIndex,
                        spec.gatorSubImageWidth,
                        {
                            x: home.center.x,
                            y: home.center.y,
                        },
                        0,
                        spec.gatorSize,
                    );
                }
                
            });
        }
    }

    return {
        render: render
    };
}(MyGame.graphics));