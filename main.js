let stage;
let paper;
let rotRate = 10;
let trash;
let trashDistance = 50;
let throwing = false;
let hitIcon;
let missIcon;
let backboard;
let backboardActive = false;

let totalShots = 0;
let shotsMade = 0;

var myEasing = function(k) {
    var t = (k*100);
    var d = 100;
    var ts = (t/=d)*t;
    var tc = ts*t;
    return (1.3*tc*ts + -3.25*ts*ts + 3.9*tc + -2.6*ts + 1.65*t);
};

function newPaper() {
    paper = new createjs.Bitmap('img/paper.png');
    paper.scale = 0.1;
    paper.x = 0;
    paper.y = 300;

    rotRate = Math.random() * 40 - 20;

    paper.image.onload = function() {
        stage.addChild(paper);
        stage.setChildIndex(paper, 0)
        stage.update();

        paper.regX = paper.image.width / 2;
        paper.regY = paper.image.height / 2;

    };
}

function showIcon(icon) {
    icon.y += 50;
    createjs.Tween.get(icon)
        .to({alpha: 1, y: icon.y - 50}, 500, createjs.Ease.sineOut)
        .wait(250)
        .to({alpha: 0}, 250);
}

function hit() {
    createjs.Tween.get(paper).to({guide: {path: [paper.x, paper.y, trash.x * 0.7, 0, trash.x + 20, trash.y + 40]}}, 1000, myEasing)
        .call(function() {
            stage.removeChild(paper);
            throwing = false;
            showIcon(hitIcon);
        });
}

function missShort() {
    createjs.Tween.get(paper).to({guide: {path: [paper.x, paper.y, trash.x * 0.35, 0, trash.x * 0.7 + (Math.random() * 100 - 50), trash.y + 40]}}, 800, myEasing)
        .call(function() {
            stage.removeChild(paper);
            throwing = false;
            showIcon(missIcon);

        });
}

function missLong() {
    createjs.Tween.get(paper).to({guide: {path: [paper.x, paper.y, trash.x * 0.9, 0, trash.x + 300 + (Math.random() * 100 - 50), trash.y + 40]}}, 1200, myEasing)
        .call(function() {
            stage.removeChild(paper);
            throwing = false;
            showIcon(missIcon);

        });
}

function offBackboard() {
    createjs.Tween.get(paper).to({guide: {path: [paper.x, paper.y, trash.x * 0.6, 0, backboard.x - 50, backboard.y - 70]}}, 800, myEasing)
        .call(function () {
           rotRate = 0;
        })
        .to({x: trash.x, y: trash.y + 40}, 500, createjs.Ease.quadIn)
        .call(function() {
            stage.removeChild(paper);
            throwing = false;
            showIcon(hitIcon);
        });
}

function init() {
    let canvas = document.getElementById('gameCanvas');
    stage = new createjs.Stage(canvas);
    createjs.MotionGuidePlugin.install();

    $('#percentRow').hide();
    $('#decimalRow').hide();


    trash = new createjs.Bitmap('img/trash.png');
    trash.scale = 0.15;
    trash.x = 600;
    trash.y = 350;
    trash.image.onload = function() {
        stage.addChild(trash);
        stage.update();

        trash.regX = trash.image.width / 2;
        trash.regY = trash.image.height / 2;
    };


    $('#throwButton').click(function() {
        if (throwing) {
            return;
        }

        throwing = true;
        newPaper();
        totalShots += 1;
        let roll = Math.random();
        if (roll < 0.8 - trashDistance / 100 * 0.6) {
            hit();
            shotsMade += 1;
            hitIcon.x = trash.x;
        } else {
            missIcon.x = trash.x;
            if (Math.random() < 0.5) {
                missShort();
            } else {
                if (backboardActive) {
                    hitIcon.x = trash.x;
                    offBackboard();
                    shotsMade += 1;
                } else {
                    missLong();
                }
            }
        }
        $('#shotsLabel').text(shotsMade + ' / ' + totalShots);
        $('#decimalLabel').text((shotsMade / totalShots).toFixed(2));
        $('#percentLabel').text((shotsMade / totalShots * 100).toFixed(2) + '%');

    });

    $('#resetButton').click(function() {
       totalShots = 0;
       shotsMade = 0;
        $('#shotsLabel').text('0 / 0');
        $('#decimalLabel').text('');
        $('#percentLabel').text('');
    });

    let distanceLabel = $('#distanceLabel');
    $('#distanceSlider')[0].oninput = function() {
        if (!throwing) {
            trash.x = this.value * 5 + 300;
            trashDistance = this.value;
            backboard.x = trash.x + 80;
            distanceLabel.text(this.value);
        }
    };

    hitIcon = new createjs.Bitmap('img/yes.png');
    hitIcon.scale = 0.5;
    hitIcon.alpha = 0;
    hitIcon.y = 50;

    hitIcon.image.onload = function() {
        stage.addChild(hitIcon);
        hitIcon.regX = hitIcon.image.width / 2;
        hitIcon.regY = hitIcon.image.height / 2;
    };

    missIcon = new createjs.Bitmap('img/no.png');
    missIcon.scale = 0.5;
    missIcon.alpha = 0;
    missIcon.y = 50;


    missIcon.image.onload = function() {
        stage.addChild(missIcon);
        missIcon.regX = missIcon.image.width / 2;
        missIcon.regY = missIcon.image.height / 2;
    };

    backboard = new createjs.Bitmap('img/backboard.png');
    backboard.scale = 0.3;
    backboard.x = trash.x + 80;
    backboard.y = 280;
    backboard.alpha = 0;

    backboard.image.onload = function() {
        stage.addChild(backboard);
        backboard.regX = backboard.image.width / 2;
        backboard.regY = backboard.image.height / 2;
    };

    $('#percentCheckbox').on('change', function() {
        if (this.checked) {
            $('#percentRow').show();
        } else {
            $('#percentRow').hide();
        }
    });

    $('#decimalCheckbox').on('change', function() {
        if (this.checked) {
            $('#decimalRow').show();
        } else {
            $('#decimalRow').hide();
        }
    });

    $('#backboardCheckbox').on('change', function() {
        if (this.checked) {
            backboard.alpha = 1;
            backboardActive = true;
        } else {
            backboard.alpha = 0;
            backboardActive = false;
        }
    });


    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', tick);
}

function stop() {
    createjs.Ticker.removeEventListener('tick', tick);
}



function tick(event) {
    if (paper !== undefined) {
        paper.rotation += rotRate;
    }

    stage.update(event);
}

$(document).ready(init);