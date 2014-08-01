function randomInt(max, min) {
	if (typeof min === 'undefined') min = 0;
	return Math.floor(Math.random() * (max - min)) + min;
}

function FrameManager() {

}

function AutomataGame(containerSelector) {
	this.Constants = new AutomataConstants();

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
	this.cellCache = new CellCacheQueue(this);
	this.frameManager = function() {

	};

	this.start = function() {
		this.players[0].createCell(0, 0);
	};

	var turnCounter = 0;
	this.turn = function() {
		turnCounter++;
		// console.log('Taking turn!');

		Cell.iterateRandomActive(function(cell) {
			cell.takeTurn();
			cell.draw();
		});

		setTimeout(this.turn, 10);
	};

	this.start();
	this.turn();
}

