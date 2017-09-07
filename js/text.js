var text = function(){
  this.info = document.getElementById('info');
  this.back = document.getElementById("back");
  this.restart = document.getElementById("reStart");
  this.next = document.getElementById("next");
  this.pre = document.getElementById("pre");
  this.list = document.getElementById('list');
  this.userid = document.getElementById('userid');
  this.numOfPeople = document.getElementById('numOfPeople');
  this.status = document.getElementById('status');
};


text.prototype = {

    initOffline: function() {

        this.info.style.display = "block";
        this.back.style.display = "block";
        this.restart.style.display = "block";
        this.next.style.display = "None";
        this.pre.style.display = "None";

        this.back.value = "悔棋";
        this.info.innerHTML = "黑棋先下吧！";
        this.back.onclick = cont.dealBack;
        this.restart.onclick = cont.init;
    },

    initOnline: function() {

        this.info.style.display = "block";
        this.list.style.display = "block";
        this.userid.style.display = "block";
        this.numOfPeople.style.display = "block";
        this.status.style.display = "block";

        this.info.innerHTML = "邀請人對戰吧！";
    },

    showWhich: function() {

        if (cont.Logic.turn === 1) {
            this.info.innerHTML = "該黑棋下";
        } else {
            this.info.innerHTML = "該白棋下";
        }

    },

    congratulation: function(win) {

        this.back.value = "復盤";
        this.back.onclick = cont.dealRePlay;
        if (win === 1) {
            this.info.innerHTML = "恭喜黑棋獲勝！";
        } else {
            this.info.innerHTML = "恭喜白棋獲勝！";
        }
    }
};