// --------------------------------------------------------------
//
// Renders a Text object.
//
//
// --------------------------------------------------------------
MyGame.render.Text = (function(graphics) {
    'use strict';

    function render(spec, useBG=false) {
        graphics.drawText(spec, useBG);
    }

    return {
        render: render
    };
}(MyGame.graphics));
