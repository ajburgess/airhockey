//Create a Pixi Application
let app = new PIXI.Application({ width: 1000, height: 500, antialias: true });
app.renderer.backgroundColor = 0xf0f0f0;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

let table, player1, player2, puck, goal1, goal2;
let message;

function makeCircleSprite(radius, colour) {
    let gr = new PIXI.Graphics();
    gr.beginFill(colour);
    gr.lineStyle(0);
    gr.drawCircle(radius, radius, radius);
    gr.endFill();
    var texture = app.renderer.generateTexture(gr);

    let sprite = new PIXI.Sprite(texture);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;

    return sprite;
}

function setup() {
    puck = makeCircleSprite(25, 0x000000);
    puck.vx = 0;
    puck.vy = 0;
    puck.x = 150;
    puck.y = 250;

    // goal1 = g.rectangle(puck.width * 0.70, 200, 0x808080);
    // goal1.x = 0;
    // goal1.y = table.height / 2 - goal1.height / 2;

    // goal2 = g.rectangle(puck.width * 0.70, 200, 0x808080);
    // goal2.x = table.width - goal2.width;
    // goal2.y = table.height / 2 - goal1.height / 2;

    player1 = makeCircleSprite(25, 0x00ff00);
    player1.x = 50;
    player1.y = 50;
    player1.previousX = player1.x;
    player1.previousY = player1.y;
    player1.score = 0;

    player2 = makeCircleSprite(25, 0x0000ff);
    player2.x = 925;
    player2.y = 200;
    player2.previousX = player2.x;
    player2.previousY = player2.y;
    player2.score = 0;

    // message = g.text("", "64px Futura", 0xd0d0d0, 20, 20);

    for (player of [player1, player2]) {
        player.interactive = true;
        player.buttonMode = true;

        player.mousedown = player.touchstart = function (data) {
            this.data = data;
            this.dragging = true;
        }

        player.mouseup = player.mouseupoutside = player.touchend = player.touchendoutside = function (data) {
            this.dragging = false;
            this.data = null;
        }

        player.mousemove = player.touchmove = function (data) {
            if (this.dragging) {
                this.position.x = this.data.data.global.x;
                this.position.y = this.data.data.global.y;
            }
        }
    }

    app.stage.addChild(puck);
    app.stage.addChild(player1);
    app.stage.addChild(player2);

    // g.stage.addChild(goal1);
    // g.stage.addChild(goal2);
    // g.stage.addChild(message);
    // g.stage.addChild(puck);

    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    play(delta);
}

function play(delta) {
    contain(player1, { x: 0, y: 0, width: 500, height: 500 }, true);
    contain(player2, { x: 500, y: 0, width: 500, height: 500 }, true);
}

setup();

function contain(sprite, container) {

    let collision = undefined;

    //Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }

    //Return the `collision` value
    return collision;
}

// function play() {
//     g.contain(player1, { x: 0, y: 0, width: 500, height: 500 }, true);
//     g.contain(player2, { x: 500, y: 0, width: 500, height: 500 }, true);

//     for (player of [player1, player2]) {
//         if (player.dragging) {
//             player.vx = (player.x - player.previousX);
//             player.vy = (player.y - player.previousY);
//         }
//         else {
//             player.vx = player.vx * 0.95;
//             player.vy = player.vy * 0.95;
//             g.move(player);
//         }
//         player.previousX = player.x;
//         player.previousY = player.y;

//         g.bump.movingCircleCollision(player, puck);

//         puck.vx = puck.vx * 0.995;
//         puck.vy = puck.vy * 0.995;

//         if (g.bump.hitTestPoint(puck, goal1)) {
//             player2.score++;
//             puck.x = 150;
//             puck.y = 250;
//             puck.vx = 0;
//             puck.vy = 0;
//         }
//         else if (g.bump.hitTestPoint(puck, goal2)) {
//             player1.score++;
//             puck.x = 850;
//             puck.y = 250;
//             puck.vx = 0;
//             puck.vy = 0;
//         }
//     }

//     g.move(puck);
//     g.contain(puck, table, true);

//     message.text = `${player1.score} - ${player2.score}`;
//     g.stage.putCenter(message);
// }
