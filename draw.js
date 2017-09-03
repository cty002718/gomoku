const TOP = 30;
const LEFT = 40;
const LENGTH = 560;
const NUM = 15;
const PADDING = LENGTH / (NUM - 1);
const SHIFT = PADDING / 2;

var map = new Array(15);
for (var i = 0; i < 15; i++) {
    map[i] = new Array(15);
}

var turn = 1;
var pathx = [];
var pathy = [];

window.onload = function() {
    controller.init();
    document.body.onmousemove = controller.dealMove;
};

var draw = {

    init: function() {

        var boardLayer = document.getElementById("boardLayer");
        var stoneLayer = document.getElementById("stoneLayer");
        boardLayer.style.top = TOP + 'px';
        boardLayer.style.left = LEFT + 'px';
        boardLayer.width = LENGTH + PADDING;
        boardLayer.height = LENGTH + PADDING;
        stoneLayer.style.top = TOP + 'px';
        stoneLayer.style.left = LEFT + 'px';
        stoneLayer.width = LENGTH + PADDING;
        stoneLayer.height = LENGTH + PADDING;
        stoneLayer.onclick = controller.dealClick;

        var ctx = boardLayer.getContext("2d");
        ctx.beginPath();
        ctx.clearRect(0, 0, LENGTH + PADDING, LENGTH + PADDING);
        ctx.fillStyle = '#ffaf1a';
        ctx.fillRect(SHIFT, SHIFT, LENGTH, LENGTH);
        ctx.lineWidth = 2;
        for (var i = 0; i <= NUM; i++) {
            ctx.moveTo(SHIFT, SHIFT + i * PADDING);
            ctx.lineTo(SHIFT + LENGTH, SHIFT + i * PADDING);
            ctx.moveTo(SHIFT + i * PADDING, SHIFT);
            ctx.lineTo(SHIFT + i * PADDING, SHIFT + LENGTH);
        }
        ctx.stroke();
        ctx = stoneLayer.getContext("2d");
        ctx.lineWidth = 2;
    },

    drawStone: function(i, j, turn) {

        var ctx = document.getElementById("stoneLayer").getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        if (turn === 1) {
            ctx.fillStyle = 'black';
        } else {
            ctx.fillStyle = 'white';
        }

        var locx = SHIFT + i * PADDING;
        var locy = SHIFT + j * PADDING;

        ctx.arc(locx, locy, SHIFT - 2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    },

    drawHalfStone: function(i, j, turn) {
        var ctx = document.getElementById("stoneLayer").getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        if (turn === 1) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
        } else {
            ctx.fillStyle = 'rgba(256,256,256,0.5)';
        }

        var locx = SHIFT + i * PADDING;
        var locy = SHIFT + j * PADDING;

        ctx.arc(locx, locy, SHIFT - 2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    },

    cancel: function(cancelx, cancely) {

        var ctx = document.getElementById("stoneLayer").getContext("2d");
        ctx.clearRect(cancelx * PADDING + 1, cancely * PADDING + 1, PADDING - 2, PADDING - 2);
    }
};

var logic = {

    init: function() {

        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                map[i][j] = 0;
            }
        }

        turn = 1;
        pathx = [];
        pathy = [];
    },

    putStone: function(i, j) {
        map[i][j] = turn;
        pathx.push(i);
        pathy.push(j);
    },

    isGameOver: function() {
        var dirx = [1, 1, 0, -1];
        var diry = [0, 1, 1, 1];
        for (var i = 0; i < NUM; i++) {
            for (var j = 0; j < NUM; j++) {
                if (map[i][j] === 0) {
                    continue;
                }
                var color = map[i][j];
                for (var k = 0; k < 4; k++) {
                    var count = 0;
                    for (var w = 1; w < 5; w++) {
                        var newi = i + dirx[k] * w;
                        var newj = j + diry[k] * w;
                        if (logic.isInBoard(newi, newj) && map[newi][newj] === color) {
                            count++;
                        }
                    }
                    if (count === 4) {
                        return color;
                    }
                }
            }
        }
        return 0;
    },

    isInBoard: function(x, y) {
        if (x >= 0 && x < NUM && y >= 0 && y < NUM) {
            return true;
        }
    },

    freeze: function() {
        for (var i = 0; i < NUM; i++) {
            for (var j = 0; j < NUM; j++) {
                map[i][j] = 2;
            }
        }
    }

};


var text = {

    init: function() {
        var which = document.getElementById("turn");
        which.innerHTML = "黑棋先下吧！";

        var back = document.getElementById("back");
        back.value = "悔棋";
        back.onclick = controller.dealBack;

        var next = document.getElementById("next");
        var pre = document.getElementById("pre");

        next.style.display = "None";
        pre.style.display = "None";
    },

    showWhich: function() {

        var which = document.getElementById("turn");
        if (turn === 1) {
            which.innerHTML = "該黑棋下";
        } else {
            which.innerHTML = "該白棋下";
        }
    },

    congratulation: function(win) {
        var which = document.getElementById("turn");
        var back = document.getElementById("back");
        back.value = "復盤";
        back.onclick = controller.dealRePlay;
        if (win === 1) {
            which.innerHTML = "恭喜黑棋獲勝！";
        } else {
            which.innerHTML = "恭喜白棋獲勝！";
        }
    }
};

var controller = {

    init: function() {
        logic.init();
        draw.init();
        text.init();
    },

    dealGameOver: function() {
        var win = logic.isGameOver();
        if (win === 1) {
            alert("黑棋獲勝！");
            controller.finalBoard(win);
        }
        else if (win === -1) {
            alert("白棋獲勝！");
            controller.finalBoard(win);
        }
    },

    dealClick: function(evt) {
        var x = evt.pageX;
        var y = evt.pageY;

        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (map[i][j] !== 0) {
                    continue;
                }

                var locx = LEFT + SHIFT + i * PADDING;
                var locy = TOP + SHIFT + j * PADDING;
                var deltax = (locx - x);
                var deltay = (locy - y);
                var dis = Math.sqrt(deltax * deltax + deltay * deltay);

                if (dis < SHIFT - 2) {
                    draw.drawStone(i, j, turn);
                    logic.putStone(i, j);
                    setTimeout(controller.dealGameOver, 100);
                    turn = -turn;
                    text.showWhich();
                    break;
                }
            }
        }
    },

    finalBoard: function(win) {
        text.congratulation(win);
        logic.freeze();
    },

    dealBack: function() {

        if (pathx.length === 0) {
            return;
        }
        var cancelx = pathx.pop();
        var cancely = pathy.pop();
        map[cancelx][cancely] = 0;
        turn = -turn;
        draw.cancel(cancelx, cancely);
        text.showWhich();
    },

    dealRePlay: function() {
        var next = document.getElementById("next");
        var pre = document.getElementById("pre");

        next.style.display = "block";
        pre.style.display = "block";

        draw.init();
        controller.rePlayNum = 0;
        turn = 1;
    },

    preX: 0,
    preY: 0,

    dealMove: function(evt) {
        var x = evt.pageX;
        var y = evt.pageY;

        if (map[controller.preX][controller.preY] === 0) {
            draw.cancel(controller.preX, controller.preY);
        }
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (map[i][j] !== 0) {
                    continue;
                }

                var locx = LEFT + SHIFT + i * PADDING;
                var locy = TOP + SHIFT + j * PADDING;
                var deltax = (locx - x);
                var deltay = (locy - y);
                var dis = Math.sqrt(deltax * deltax + deltay * deltay);

                if (dis < SHIFT - 2 && map[i][j] === 0) {
                    draw.drawHalfStone(i, j, turn);
                    controller.preX = i;
                    controller.preY = j;
                    break;
                }
            }
        }
    },

    rePlayNum: 0,

    dealNext: function() {
        if (controller.rePlayNum < pathx.length) {
            draw.drawStone(pathx[controller.rePlayNum], pathy[controller.rePlayNum], turn);
            controller.rePlayNum++;
            turn = -turn;
        }
    },

    dealPre: function() {
        if (controller.rePlayNum > 0) {
            controller.rePlayNum--;
            draw.cancel(pathx[controller.rePlayNum], pathy[controller.rePlayNum], turn);
            turn = -turn;
        }
    }

};

