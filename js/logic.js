var logic = function() {
  this.map = new Array(NUM);
  for (var i = 0; i < NUM; i++)
      this.map[i] = new Array(NUM);
  this.turn = 1;
  this.pathx = [];
  this.pathy = [];
};

logic.prototype = {

    init: function() {

        for (var i = 0; i < NUM; i++) {
            for (var j = 0; j < NUM; j++) {
                this.map[i][j] = 0;
            }
        }

        this.turn = 1;
        this.pathx = [];
        this.pathy = [];
    },

    putStoneColor: function(i, j, color) {
        this.map[i][j] = color;
        this.pathx.push(i);
        this.pathy.push(j);
    },

    putStone: function(i, j) {
        this.map[i][j] = this.turn;
        this.pathx.push(i);
        this.pathy.push(j);
    },

    isGameOver: function() {
        var dirx = [1, 1, 0, -1];
        var diry = [0, 1, 1, 1];
        for (var i = 0; i < NUM; i++) {
            for (var j = 0; j < NUM; j++) {
                if (this.map[i][j] === 0) {
                    continue;
                }
                var color = this.map[i][j];
                for (var k = 0; k < 4; k++) {
                    var count = 0;
                    for (var w = 1; w < 5; w++) {
                        var newi = i + dirx[k] * w;
                        var newj = j + diry[k] * w;
                        if (this.isInBoard(newi, newj) && this.map[newi][newj] === color) {
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
                this.map[i][j] = 2;
            }
        }
    }

};