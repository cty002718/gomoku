var draw = function() {
    this.boardLayer = document.getElementById("boardLayer");
    this.stoneLayer = document.getElementById("stoneLayer");
};

draw.prototype = {

    init: function(online) {

        this.boardLayer.style.display = 'block';
        this.stoneLayer.style.display = 'block';

        this.boardLayer.style.top = TOP + 'px';
        this.boardLayer.style.left = LEFT + 'px';
        this.boardLayer.width = LENGTH + PADDING;
        this.boardLayer.height = LENGTH + PADDING;
        this.stoneLayer.style.top = TOP + 'px';
        this.stoneLayer.style.left = LEFT + 'px';
        this.stoneLayer.width = LENGTH + PADDING;
        this.stoneLayer.height = LENGTH + PADDING;
        if (online === false) {
            this.stoneLayer.onclick = cont.dealClick;
            document.body.onmousemove = cont.dealMove;
        }
        var ctx = this.boardLayer.getContext("2d");
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

        ctx = this.stoneLayer.getContext("2d");
        ctx.lineWidth = 2;
    },

    drawStone: function(i, j, color) {

        var ctx = this.stoneLayer.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        if (color === 1) {
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

    drawHalfStone: function(i, j, color) {
        var ctx = this.stoneLayer.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        if (color === 1) {
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

    cancel: function(i, j) {

        var ctx = this.stoneLayer.getContext("2d");
        ctx.clearRect(i * PADDING + 1, j * PADDING + 1, PADDING - 2, PADDING - 2);
    }
};



