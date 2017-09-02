var turn = 1;
var used = new Array(15);
for (var i = 0; i < 15; i++) {
    used[i] = new Array(15);
}

function init_draw() {

    for (var i = 0; i < 15; i++) {
        for (var j = 0;j < 15; j++) {
            used[i][j] = 0;
        }
    }
    turn = 1;
    var which = document.getElementById("turn");
    which.innerHTML = "黑棋先下吧！";

    var canvas = document.getElementById("canvas");
    canvas.onclick = deal_click;
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.clearRect(0, 0, 600, 600);
    ctx.fillStyle = '#ffaf1a';
    ctx.fillRect(20, 20, 560, 560);
    ctx.lineWidth = 2;
    for (var i = 0;i <= 15; i++) {
        ctx.moveTo(20, 20+i*40);
        ctx.lineTo(580, 20+i*40);
        ctx.moveTo(20+i*40, 20);
        ctx.lineTo(20+i*40, 580);
    }
    ctx.stroke();
}

function deal_click(evt) {
    var x = evt.pageX;
    var y = evt.pageY;

    for (var i = 0; i < 15; i++)
        for (var j = 0; j < 15; j++) {
            if (used[i][j] !== 0) {
                continue;
            }
            var locx = 30. + i*40;
            var locy = 30. + j*40;
            var deltax = (locx - x);
            var deltay = (locy - y);
            var dis = Math.sqrt(deltax*deltax + deltay*deltay);

            if (dis < 17) {
                draw_stone(locx-10, locy-10, i, j);
                break;
            }
        }
}

function draw_stone(locx, locy, i, j) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var which = document.getElementById("turn");
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    if (turn === 1) {
        ctx.fillStyle = 'black';
        which.innerHTML = "該白棋下";
    } else {
        ctx.fillStyle = 'white';
        which.innerHTML = "該黑棋下";
    }
    ctx.arc(locx, locy, 18, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();

    setTimeout(function () {
        used[i][j] = turn;
        var win = isGameOver();
        if (win === 1) {
            alert("黑棋獲勝！");
            clearBoard(win);
        }
        else if (win === -1) {
            alert("白棋獲勝！");
            clearBoard(win);
        }
        turn = -turn;
    }, 10);
}

function isGameOver() {
    var dirx = [1, 1, 0, -1];
    var diry = [0, 1, 1, 1];
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (used[i][j] === 0) {
                continue;
            }
            var color = used[i][j];
            for (var k = 0; k < 4; k++) {
                var count = 0;
                for (var w = 1; w < 5; w++) {
                    var newi = i + dirx[k] * w;
                    var newj = j + diry[k] * w;
                    if (isInBoard(newi, newj) && used[newi][newj] === color) {
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
}

function isInBoard(x, y) {
    if (x >= 0 && x < 15 && y >= 0 && y < 15) {
        return true;
    }
}

function clearBoard(win) {
    var which = document.getElementById("turn");
    if (win === 1) {
        which.innerHTML = "恭喜黑棋獲勝！";
    } else {
        which.innerHTML = "恭喜白棋獲勝！";
    }
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            used[i][j] = 2;
        }
    }
}

window.onload = init_draw;