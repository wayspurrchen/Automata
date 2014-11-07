function randomInt(max, min) {
	if (typeof min === 'undefined') min = 0;
	return Math.floor(Math.random() * (max - min)) + min;
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function AutomataGame(containerSelector, canvas) {
	this.Constants = new AutomataConstants();

	this.canvas = canvas;
	this.canvas.width  =
		this.Constants.GRID_WIDTH * this.Constants.GRID_CELL_SIZE;
	this.canvas.height =
		this.Constants.GRID_HEIGHT * this.Constants.GRID_CELL_SIZE;
	this.canvasBuffer = document.createElement('canvas');
	this.canvasBuffer.width  = this.canvas.width;
	this.canvasBuffer.height = this.canvas.height;
	this.bufferContext = this.canvas.getContext('2d');
	this.context = this.canvas.getContext('2d');
	this.clearCanvas = function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};

	this.players = [];
	this.takenColors = [];
	this.colorAvailable = function(color) {
		if (this.takenColors[color]) {
			return false;
		} else {
			return true;
		}
	};

	this.players.push(new Player(this));
	this.grid = new Grid(
		this,
		this.Constants.GRID_WIDTH,
		this.Constants.GRID_HEIGHT,
		containerSelector
	);

	this.start = function() {
		// TODO
	};

	var turnCounter = 0;
	this.turn = function() {
		this.clearCanvas();

		turnCounter++;
		// console.log('Taking turn!');
		
		Cell.iterateActive(function(cell) {
			cell.movedThisTurn = false;
		});

		Cell.iterateRandomActive(function(cell) {
			cell.takeTurn();
			cell.draw();
		});

		this.context.drawImage(this.canvasBuffer, 0, 0);
		setTimeout(this.turn.bind(this), 600);
	};

	this.start();
	this.turn();
}