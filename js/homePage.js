const TOP = 30;
const LEFT = 40;
const LENGTH = 560;
const NUM = 15;
const PADDING = LENGTH / (NUM - 1);
const SHIFT = PADDING / 2;

var cont;

window.onload = function() {

    var button1 = document.getElementById('button1');
    var button2 = document.getElementById('button2');
    button1.onclick = function() {
        cont = new controlOffLine();
        cont.init();
        document.getElementById('menu').style.display = 'None';
    };

    button2.onclick = function() {
        cont = new controlOnLine();
        cont.init();
        document.getElementById('menu').style.display = 'None';
    }
};

var controlOnLine = function() {
    this.Draw = new draw();
    this.Logic = new logic();
    this.Text = new text();
    this.Com = new com();
    this.preX = 0;
    this.preY = 0;
    this.rePlayNum = 0;
};

controlOnLine.prototype = {
    init: function() {
        cont.Draw.init(true);
        cont.Text.initOnline();
        cont.Com.init();
        cont.Logic.init();
    },

    dealGameOver: function() {
        var win = cont.Logic.isGameOver();
        if (win === 1) {
            alert("黑棋獲勝！");
            cont.finalBoard(win);
        }
        else if (win === -1) {
            alert("白棋獲勝！");
            cont.finalBoard(win);
        }

    },

    dealGiveUp: function() {
        cont.Com.socket.emit('giveup', cont.Com.oppent);
        cont.finalBoard(-cont.Com.color);
    },

    dealOnlineClick: function(evt) {
        var x = evt.pageX;
        var y = evt.pageY;

        for (var i = 0; i < NUM; i++) {
            for (var j = 0; j < NUM; j++) {
                if (cont.Logic.map[i][j] !== 0) {
                    continue;
                }

                var locx = LEFT + SHIFT + i * PADDING;
                var locy = TOP + SHIFT + j * PADDING;
                var deltax = (locx - x);
                var deltay = (locy - y);
                var dis = Math.sqrt(deltax * deltax + deltay * deltay);

                if (dis < SHIFT - 2) {
                    cont.Draw.drawStone(i, j, cont.Com.color);
                    cont.Logic.putStoneColor(i, j, cont.Com.color);
                    setTimeout(cont.dealGameOver, 100);
                    document.getElementById('info').innerHTML = '等待對方下一手...';
                    cont.Draw.stoneLayer.onclick = function(){};
                    document.body.onmousemove = function(){};
                    var back = document.getElementById('back');
                    back.onclick = cont.dealBack;
                    cont.Com.socket.emit('yourturn', cont.Com.oppent, i, j);
                    break;
                }
            }
        }
    },

    dealClick: function(evt) {
        var x = evt.pageX;
        var y = evt.pageY;

        for (var i = 0; i < NUM; i++) {
            for (var j = 0; j < NUM; j++) {
                if (cont.Logic.map[i][j] !== 0) {
                    continue;
                }

                var locx = LEFT + SHIFT + i * PADDING;
                var locy = TOP + SHIFT + j * PADDING;
                var deltax = (locx - x);
                var deltay = (locy - y);
                var dis = Math.sqrt(deltax * deltax + deltay * deltay);

                if (dis < SHIFT - 2) {
                    cont.Draw.drawStone(i, j, cont.Logic.turn);
                    cont.Logic.putStone(i, j);
                    setTimeout(cont.dealGameOver, 100);
                    cont.Logic.turn = -cont.Logic.turn;
                    cont.Text.showWhich();
                    break;
                }
            }
        }
    },

    finalBoard: function(win) {
        var restart = document.getElementById('reStart');
        restart.value = '回到主畫面';
        restart.onclick = function() {
            window.location.reload();
        };

        var back = document.getElementById('back');
        back.value = '復盤';
        back.onclick = cont.dealRePlay;

        cont.Com.playState = 'watch';
        cont.Text.congratulation(win);
        cont.Logic.freeze();
    },

    dealBack: function() {

        if (cont.Logic.pathx.length === 0) {
            return;
        }

        cont.Com.socket.emit('back', cont.Com.oppent);
        document.getElementById('info').innerHTML = '等待對方回應...';

    },

    dealRePlay: function() {
        var next = document.getElementById("next");
        var pre = document.getElementById("pre");

        next.style.display = "block";
        pre.style.display = "block";
        next.onclick = cont.dealNext;
        pre.onclick = cont.dealPre;

        cont.Draw.init();
        cont.rePlayNum = 0;
        cont.Logic.turn = 1;
    },


    dealMove: function(evt) {
        var x = evt.pageX;
        var y = evt.pageY;

        if (cont.Logic.map[cont.preX][cont.preY] === 0) {
            cont.Draw.cancel(cont.preX, cont.preY);
        }
        for (var i = 0; i < NUM; i++) {
            for (var j = 0; j < NUM; j++) {
                if (cont.Logic.map[i][j] !== 0) {
                    continue;
                }

                var locx = LEFT + SHIFT + i * PADDING;
                var locy = TOP + SHIFT + j * PADDING;
                var deltax = (locx - x);
                var deltay = (locy - y);
                var dis = Math.sqrt(deltax * deltax + deltay * deltay);

                if (dis < SHIFT - 2 && cont.Logic.map[i][j] === 0) {
                    cont.Draw.drawHalfStone(i, j, cont.Logic.turn);
                    cont.preX = i;
                    cont.preY = j;
                    break;
                }
            }
        }
    },


    dealNext: function() {
        if (cont.rePlayNum < cont.Logic.pathx.length) {
            cont.Draw.drawStone(cont.Logic.pathx[cont.rePlayNum], cont.Logic.pathy[cont.rePlayNum], cont.Logic.turn);
            cont.rePlayNum++;
            cont.Logic.turn = -cont.Logic.turn;
        }
    },

    dealPre: function() {
        if (cont.rePlayNum > 0) {
            cont.rePlayNum--;
            cont.Draw.cancel(cont.Logic.pathx[cont.rePlayNum], cont.Logic.pathy[cont.rePlayNum], cont.Logic.turn);
            cont.Logic.turn = -cont.Logic.turn;
        }
    }

};

var controlOffLine = function() {
    this.Draw = new draw();
    this.Logic = new logic();
    this.Text = new text();
    this.preX = 0;
    this.preY = 0;
    this.rePlayNum = 0;
};

controlOffLine.prototype = {

    init: function() {
        cont.Logic.init();
        cont.Draw.init(false);
        cont.Text.initOffline();
    },

    dealGameOver: function() {
        var win = cont.Logic.isGameOver();
        if (win === 1) {
            alert("黑棋獲勝！");
            cont.finalBoard(win);
        }
        else if (win === -1) {
            alert("白棋獲勝！");
            cont.finalBoard(win);
        }
    },

    dealClick: function(evt) {
        var x = evt.pageX;
        var y = evt.pageY;

        for (var i = 0; i < NUM; i++) {
            for (var j = 0; j < NUM; j++) {
                if (cont.Logic.map[i][j] !== 0) {
                    continue;
                }

                var locx = LEFT + SHIFT + i * PADDING;
                var locy = TOP + SHIFT + j * PADDING;
                var deltax = (locx - x);
                var deltay = (locy - y);
                var dis = Math.sqrt(deltax * deltax + deltay * deltay);

                if (dis < SHIFT - 2) {
                    cont.Draw.drawStone(i, j, cont.Logic.turn);
                    cont.Logic.putStone(i, j);
                    setTimeout(cont.dealGameOver, 100);
                    cont.Logic.turn = -cont.Logic.turn;
                    cont.Text.showWhich();
                    break;
                }
            }
        }
    },

    finalBoard: function(win) {
        cont.Text.congratulation(win);
        cont.Logic.freeze();
    },

    dealBack: function() {

        if (cont.Logic.pathx.length === 0) {
            return;
        }
        var cancelx = cont.Logic.pathx.pop();
        var cancely = cont.Logic.pathy.pop();
        cont.Logic.map[cancelx][cancely] = 0;
        cont.Logic.turn = -cont.Logic.turn;
        cont.Draw.cancel(cancelx, cancely);
        cont.Text.showWhich();
    },

    dealRePlay: function() {
        var next = document.getElementById("next");
        var pre = document.getElementById("pre");

        next.style.display = "block";
        pre.style.display = "block";
        next.onclick = cont.dealNext;
        pre.onclick = cont.dealPre;

        cont.Draw.init();
        cont.rePlayNum = 0;
        cont.Logic.turn = 1;
    },


    dealMove: function(evt) {
        var x = evt.pageX;
        var y = evt.pageY;

        if (cont.Logic.map[cont.preX][cont.preY] === 0) {
            cont.Draw.cancel(cont.preX, cont.preY);
        }
        for (var i = 0; i < NUM; i++) {
            for (var j = 0; j < NUM; j++) {
                if (cont.Logic.map[i][j] !== 0) {
                    continue;
                }

                var locx = LEFT + SHIFT + i * PADDING;
                var locy = TOP + SHIFT + j * PADDING;
                var deltax = (locx - x);
                var deltay = (locy - y);
                var dis = Math.sqrt(deltax * deltax + deltay * deltay);

                if (dis < SHIFT - 2 && cont.Logic.map[i][j] === 0) {
                    cont.Draw.drawHalfStone(i, j, cont.Logic.turn);
                    cont.preX = i;
                    cont.preY = j;
                    break;
                }
            }
        }
    },


    dealNext: function() {
        if (cont.rePlayNum < cont.Logic.pathx.length) {
            cont.Draw.drawStone(cont.Logic.pathx[cont.rePlayNum], cont.Logic.pathy[cont.rePlayNum], cont.Logic.turn);
            cont.rePlayNum++;
            cont.Logic.turn = -cont.Logic.turn;
        }
    },

    dealPre: function() {
        if (cont.rePlayNum > 0) {
            cont.rePlayNum--;
            cont.Draw.cancel(cont.Logic.pathx[cont.rePlayNum], cont.Logic.pathy[cont.rePlayNum], cont.Logic.turn);
            cont.Logic.turn = -cont.Logic.turn;
        }
    }

};