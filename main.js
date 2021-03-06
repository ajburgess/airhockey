let g = hexi(1000, 500, setup);
g.backgroundColor = 0xf0f0f0;
g.scaleToWindow();

let table, player1, player2, puck, goal1, goal2;
let message;

g.start();

function setup() {
    table = g.rectangle(1000, 500, 0xf0f0f0);

    puck = g.circle(50, "black");
    puck.anchor.x = 0.5;
    puck.anchor.y = 0.5;
    puck.vx = 0;
    puck.vy = 0;
    puck.x = 500;
    puck.y = 250;

    goal1 = g.rectangle(puck.width * 0.70, 200, 0x808080);
    goal1.x = 0;
    goal1.y = table.height / 2 - goal1.height / 2;

    goal2 = g.rectangle(puck.width * 0.70, 200, 0x808080);
    goal2.x = table.width - goal2.width;
    goal2.y = table.height / 2 - goal1.height / 2;

    player1 = g.circle(80, "red");
    player1.anchor.x = 0.5;
    player1.anchor.y = 0.5;
    player1.x = 100;
    player1.y = 250;
    player1.previousX = player1.x;
    player1.previousY = player1.y;
    player1.score = 0;

    player2 = g.circle(80, "red");
    player2.anchor.x = 0.5;
    player2.anchor.y = 0.5;
    player2.x = 900;
    player2.y = 250;
    player2.previousX = player2.x;
    player2.previousY = player2.y;
    player2.score = 0;

    message = g.text("", "64px Futura", 0xd0d0d0, 20, 20);

    for (player of [player1, player2]) {
        // player.interact = true;
        // player.draggable = true;

        player.interact = true;
        player.interactive = true;
        player.buttonMode = true;

        player.mousedown = player.touchstart = function (event) {
            this.data = event.data;
            this.dragging = true;
        }

        player.mouseup = player.mouseupoutside = player.touchend = player.touchendoutside = function (data) {
            this.dragging = false;
            this.data = null;
        }

        player.mousemove = player.touchmove = function (event) {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x;
                this.position.y = newPosition.y;
            }
        }
    }

    g.stage.addChild(table);
    g.stage.addChild(goal1);
    g.stage.addChild(goal2);
    g.stage.addChild(message);
    g.stage.addChild(player1);
    g.stage.addChild(player2);
    g.stage.addChild(puck);

    g.state = play;
}

function play() {
    g.contain(player1, { x: table.x, y: table.y, width: table.halfWidth, height: table.height }, true);
    g.contain(player2, { x: table.halfWidth, y: table.y, width: table.width, height: table.height }, true);

    for (player of [player1, player2]) {
        if (player.dragging || player.pressed) {
            player.vx = (player.x - player.previousX);
            player.vy = (player.y - player.previousY);
        }
        else {
            player.vx = player.vx * 0.95;
            player.vy = player.vy * 0.95;
            g.move(player);
        }
        player.previousX = player.x;
        player.previousY = player.y;

        g.bump.movingCircleCollision(player, puck);

        puck.vx = puck.vx * 0.995;
        puck.vy = puck.vy * 0.995;

        if (g.bump.hitTestPoint(puck, goal1)) {
            player2.score++;
            puck.x = 250;
            puck.y = 250;
            puck.vx = 0;
            puck.vy = 0;
        }
        else if (g.bump.hitTestPoint(puck, goal2)) {
            player1.score++;
            puck.x = 750;
            puck.y = 250;
            puck.vx = 0;
            puck.vy = 0;
        }
    }

    g.move(puck);
    g.contain(puck, table, true);

    message.text = `${player1.score} - ${player2.score}`;
    g.stage.putCenter(message);
}
