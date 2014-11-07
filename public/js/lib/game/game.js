function GameController() {
	
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

	this.cellController = new CellController();

	this.broods = [];
	this.takenColors = [];
	this.colorAvailable = function(color) {
		if (this.takenColors[color]) {
			return false;
		} else {
			return true;
		}
	};

	this.addBrood = function(color) {
		this.broods = new Brood(this, color);
	};

	this.addBrood('#000000');
	this.grid = new Grid(
		this,
		this.Constants.GRID_WIDTH,
		this.Constants.GRID_HEIGHT,
		containerSelector
	);

	this.start = function() {
		// TODO
	};

	this.pause = function() {
		// TODO
	};

	var turnCounter = 0;
	this.turn = function() {
		this.clearCanvas();

		this.cellController.turn();

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