var com = function() {
    this.socket = null;
    this.playState = 'free';
    this.stoneState = null;
    this.color = 0;
    this.userId = -1;
    this.oppent = -1;
    this.t = null;
};

com.prototype = {
    init: function() {
        var that = this;
        this.socket = io.connect();
        this.socket.on('loginSuccess', function(Id) {
            that.userId = Id;
            var id = document.getElementById('userid');
            id.innerHTML = '你好，訪客 ' + that.userId;
        });
        this.socket.on('system', function(users) {
            var ul = document.getElementById('list').getElementsByTagName('ul')[0];
            ul.innerHTML = "";
            for (var i = 0; i < users.length; i++) {
                if(users[i] === that.userId) {
                    continue;
                }
                var ele = document.createElement('li');
                var ele2 = document.createElement('a');
                ele2.innerHTML = users[i];
                ele2.onclick = function() {
                    that.socket.emit('challenge', that.userId, this.innerHTML);
                    var status = document.getElementById('status');
                    status.innerHTML = '正在等待對方接受...';
                    that.playState = 'waiting';
                    document.getElementById('list').style.display = 'None';
                    that.t = setTimeout(function() {
                        that.playState = 'free';
                        document.getElementById('list').style.display = 'block';
                        status.innerHTML = '';
                        alert('對方忙碌中');
                    }, 5000);
                };
                ele.onmouseover = function() {
                    this.style.color = 'blue';
                };
                ele.onmouseout = function() {
                    this.style.color = 'black';
                };
                ele.appendChild(ele2);
                ul.appendChild(ele);
            }

            var numOfPeople = document.getElementById('numOfPeople');
            numOfPeople.innerHTML = '在線上數：' + users.length;
        });
        this.socket.on('challenge', function(from, who) {
            if(who == that.userId) {
                if (that.playState === 'free') {
                    var a = confirm('接受 ' + from + ' 訪客的對戰嗎？');
                    var status = document.getElementById('status');
                    if (a === true) {
                        document.getElementById('list').style.display = 'None';
                        that.socket.emit('accept', from, that.userId);

                        status.innerHTML = '連接中...';
                        that.playState = 'connecting';
                        that.oppent = from;
                        that.t = setTimeout(function() {
                            alert('對方斷線了!');
                            that.playState = 'free';
                            document.getElementById('list').style.display = 'block';
                            status.innerHTML = '';
                        }, 5000);
                    } else {
                        that.socket.emit('not_accept', from);
                    }
                } else {
                    that.socket.emit('busy', from);
                }
            }
        });
        this.socket.on('not_accept', function(from) {
            if(from == that.userId && that.playState === 'waiting') {
                alert('對方拒絕你的邀請');
                that.playState = 'free';
                document.getElementById('list').style.display = 'block';
                document.getElementById('status').innerHTML = '';
                clearTimeout(that.t);
            }
        });
        this.socket.on('busy', function(from) {
            if(from == that.userId && that.playState === 'waiting') {
                alert('對方忙碌中');
                that.playState = 'free';
                document.getElementById('list').style.display = 'block';
                document.getElementById('status').innerHTML = '';
                clearTimeout(that.t);
            }
        });

        this.socket.on('accept', function(from, to) {
            if(from == that.userId && that.playState === 'waiting') {
                that.socket.emit('acceptAc', to);
                that.oppent = to;
                that.playState = 'play';
                that.stoneState = 'myTurn';
                that.color = 1;
                cont.Draw.stoneLayer.onclick = cont.dealOnlineClick;
                document.body.onmousemove = cont.dealMove;

                cont.Logic.turn = 1;
                var restart = document.getElementById('reStart');
                restart.value = '我要棄權';
                restart.onclick = cont.dealGiveUp;
                restart.style.display = 'block';
                var back = document.getElementById('back');
                back.style.display = 'block';
                document.getElementById('status').innerHTML = '與訪客 ' + to + ' 對戰中';
                document.getElementById('info').innerHTML = '你的回合';
                clearTimeout(that.t);
            }
        });

        this.socket.on('acceptAc', function(from) {
            if(from == that.userId && that.playState === 'connecting') {
                that.playState = 'play';
                that.stoneState = 'yourTurn';
                that.color = -1;
                cont.Logic.turn = -1;
                var restart = document.getElementById('reStart');
                restart.value = '我要棄權';
                restart.onclick = cont.dealGiveUp;
                restart.style.display = 'block';
                var back = document.getElementById('back');
                back.style.display = 'block';
                back.onclick = cont.dealBack;
                document.getElementById('status').innerHTML = '與訪客 ' + that.oppent + ' 對戰中';
                document.getElementById('info').innerHTML = '等待對方下一手...';
                clearTimeout(that.t);
            }
        });

        this.socket.on('cut', function(who) {
            if (that.playState === 'play' && that.oppent == who) {
                that.playState = 'free';
                document.getElementById('list').style.display = 'block';
                document.getElementById('status').innerHTML = '';
                alert('對方斷線了!');
                window.location.reload();
            }
        });

        this.socket.on('yourturn', function(who, i, j) {
            if (that.playState === 'play' && that.userId == who) {
                cont.Draw.drawStone(i, j, -cont.Com.color);
                cont.Logic.putStoneColor(i, j, -cont.Com.color);
                setTimeout(cont.dealGameOver, 100);
                document.getElementById('info').innerHTML = '你的回合';
                cont.Draw.stoneLayer.onclick = cont.dealOnlineClick;
                document.body.onmousemove = cont.dealMove;
                var back = document.getElementById('back');
                back.onclick = function(){};
            }
        });

        this.socket.on('giveup', function(who) {
            if (that.playState === 'play' && that.userId == who) {
                alert('對方棄權了');
                cont.finalBoard(that.color);
            }
        });

        this.socket.on('back', function(who) {
            if (that.playState === 'play' && that.userId == who) {
                var a = confirm('對方要悔棋，你同意嗎？');
                if (a === false) {
                    that.socket.emit('notAgree', that.oppent);
                } else {
                    that.socket.emit('agree', that.oppent);
                    var cancelx = cont.Logic.pathx.pop();
                    var cancely = cont.Logic.pathy.pop();
                    cont.Logic.map[cancelx][cancely] = 0;
                    cont.Draw.cancel(cancelx, cancely);

                    document.getElementById('info').innerHTML = '等待對方下一手...';
                    cont.Draw.stoneLayer.onclick = function(){};
                    document.body.onmousemove = function(){};
                    var back = document.getElementById('back');
                    back.onclick = cont.dealBack;
                }
            }
        });

        this.socket.on('agree', function(who) {
            if (that.playState === 'play' && that.userId == who) {
                var cancelx = cont.Logic.pathx.pop();
                var cancely = cont.Logic.pathy.pop();
                cont.Logic.map[cancelx][cancely] = 0;
                cont.Draw.cancel(cancelx, cancely);

                document.getElementById('info').innerHTML = '你的回合';
                cont.Draw.stoneLayer.onclick = cont.dealOnlineClick;
                document.body.onmousemove = cont.dealMove;
                var back = document.getElementById('back');
                back.onclick = function(){};
            }
        });

        this.socket.on('notAgree', function(who) {
            if (that.playState === 'play' && that.userId == who) {
                alert('對方不同意');
            }
        });

    }
};