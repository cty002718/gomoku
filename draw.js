function init_draw() {
    var canvas = document.getElementById("canvas");
    canvas.onclick = deal_click;
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.fillStyle = '#ffc411';
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

var turn = 1;

function deal_click(evt) {
    var x = evt.pageX;
    var y = evt.pageY;
    for (var i = 0; i < 15; i++)
        for (var j = 0; j < 15; j++) {
            var locx = 30. + i*40;
            var locy = 30. + j*40;
            var deltax = (locx - x);
            var deltay = (locy - y);
            var dis = Math.sqrt(deltax*deltax + deltay*deltay);

            if(dis < 17) {
                draw_stone(locx-10, locy-10);
                turn = -turn;
                break;
            }
        }
}

function draw_stone(locx, locy) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var which = document.getElementById("turn");
    ctx.beginPath();
    if (turn === 1) {
        ctx.fillStyle = 'black';
        which.innerHTML = "該白棋下";
    } else {
        ctx.fillStyle = 'white';
        which.innerHTML = "該黑棋下";
    }
    ctx.arc(locx, locy, 18, 0, Math.PI * 2, true);
    ctx.fill();
}
window.onload = init_draw;