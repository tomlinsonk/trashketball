let stage;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

function init() {
    let canvas = document.getElementById('gameCanvas');
    stage = new createjs.Stage(canvas);

    let trash = new createjs.Bitmap('img/trash.png');
    trash.scale = 0.2;
    trash.x = 0.5 * CANVAS_WIDTH;
    trash.y = 0.5 * CANVAS_HEIGHT;
    trash.image.onload = function() {
        stage.addChild(trash);
        stage.update();
    };


    // createjs.Ticker.timingMode = createjs.Ticker.RAF;
    // createjs.Ticker.addEventListener('tick', tick);
}

function stop() {
    createjs.Ticker.removeEventListener('tick', tick);
}



function tick(event) {

    stage.update(event);
}

$(document).ready(init);