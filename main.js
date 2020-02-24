//Create a Pixi Application
let app = new PIXI.Application({ width: 1000, height: 500, antialias: true });
app.renderer.backgroundColor = 0xf0f0f0;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

scaleToWindow(app.renderer.view, 0x000000);

let b = new PIXI.extras.Bump();

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
    sprite.circular = true;
    sprite.radius = radius;

    return sprite;
}

function setup() {
    puck = makeCircleSprite(25, 0x000000);
    puck.vx = 5;
    puck.vy = 5;
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
                this.position.x = data.data.global.x;
                this.position.y = data.data.global.y;
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
    b.contain(player1, { x: 0, y: 0, width: 500, height: 500 }, true);
    b.contain(player2, { x: 500, y: 0, width: 1000, height: 500 }, true);

    for (player of [player1, player2]) {
        if (player.dragging) {
            player.vx = (player.position.x - player.previousX);
            player.vy = (player.position.y - player.previousY);
        }
        else {
            player.vx = player.vx * 0.95;
            player.vy = player.vy * 0.95;
            player.position.x += player.vx | 0;
            player.position.y += player.vy | 0;
        }

        player.previousX = player.position.x;
        player.previousY = player.position.y;

        b.movingCircleCollision(player, puck);
    }

    puck.vx = puck.vx * 0.995;
    puck.vy = puck.vy * 0.995;

    puck.position.x += puck.vx;
    puck.position.y += puck.vy;

    b.contain(puck, { x: 0, y: 0, width: 1000, height: 500 }, true);
}

setup();

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

function scaleToWindow(canvas, backgroundColor) {
    var newStyle = document.createElement("style");
    var style = "* {padding: 0; margin: 0}";
    newStyle.appendChild(document.createTextNode(style));
    document.head.appendChild(newStyle);

    var scaleX, scaleY, scale, center;

    //1. Scale the canvas to the correct size
    //Figure out the scale amount on each axis
    scaleX = window.innerWidth / canvas.offsetWidth;
    scaleY = window.innerHeight / canvas.offsetHeight;

    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = "scale(" + scale + ")";

    //2. Center the canvas.
    //Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and 
    //square or tall canvases should be centered horizontally
    if (canvas.offsetWidth > canvas.offsetHeight) {
        if (canvas.offsetWidth * scale < window.innerWidth) {
            center = "horizontally";
        } else {
            center = "vertically";
        }
    } else {
        if (canvas.offsetHeight * scale < window.innerHeight) {
            center = "vertically";
        } else {
            center = "horizontally";
        }
    }

    //Center horizontally (for square or tall canvases)
    var margin;
    if (center === "horizontally") {
        margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
        canvas.style.marginTop = 0 + "px";
        canvas.style.marginBottom = 0 + "px";
        canvas.style.marginLeft = margin + "px";
        canvas.style.marginRight = margin + "px";
    }

    //Center vertically (for wide canvases) 
    if (center === "vertically") {
        margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
        canvas.style.marginTop = margin + "px";
        canvas.style.marginBottom = margin + "px";
        canvas.style.marginLeft = 0 + "px";
        canvas.style.marginRight = 0 + "px";
    }

    //3. Remove any padding from the canvas  and body and set the canvas
    //display style to "block"
    canvas.style.paddingLeft = 0 + "px";
    canvas.style.paddingRight = 0 + "px";
    canvas.style.paddingTop = 0 + "px";
    canvas.style.paddingBottom = 0 + "px";
    canvas.style.display = "block";

    //4. Set the color of the HTML body background
    document.body.style.backgroundColor = backgroundColor;

    //Fix some quirkiness in scaling for Safari
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
        if (ua.indexOf("chrome") > -1) {
            // Chrome
        } else {
            // Safari
            //canvas.style.maxHeight = "100%";
            //canvas.style.minHeight = "100%";
        }
    }

    //5. Return the `scale` value. This is important, because you'll nee this value 
    //for correct hit testing between the pointer and sprites
    return scale;
}