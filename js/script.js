var cellCache;
var cells = [];

var owners = {
	0: 'white',
	1: 'red',
	2: 'blue',
	3: 'purple',
	4: 'orange',
	5: 'green',
	6: 'turquoise',
	7: 'black'
};

var mutationPoints = {};
for (var i in owners) {
	mutationPoints[i] = 0;
}

function randomInt(max, min) {
	if (typeof min === 'undefined') min = 0;
	return Math.floor(Math.random() * (max - min)) + min;
}

function setup() {
	cellCache = new CellCacheQueue();
	
}

setup();

function iterateCells(callback) {
	for (var i = 0; i < GRID_WIDTH; i++) {
		for (var j = 0; j < GRID_HEIGHT; j++) {
			callback(cells[i][j]);
		}
	}
}

function iterateRandomCells(callback) {
	var randomCells = [];
	iterateCells(function(cell) {
		randomCells.push(cell);
	});
	randomCells = _.shuffle(randomCells);
	var length = randomCells.length;
	for (var i = 0; i < length; i++) {
		callback(randomCells[i]);
	}
}

var turnCounter = 0;

function turn() {
	turnCounter++;
	// console.log('Taking turn!');
	var ownerRecord = {};

	iterateRandomCells(function(cell) {
		cell.takeTurn();
	});

	// Clear moved status from movedCells--we have to do this because
	// new cells created to the left of the cell's turn being executed
	// will be incorrectly moved on the next set of turns
	var movedLength = Cell.prototype.movedCells.length;
	for (var i = 0; i < movedLength && movedLength > 0; i++) {
		var movedCell = Cell.prototype.movedCells.pop();
		movedCell.movedThisTurn = false;
	}

	// Check ownerships after completion
	iterateCells(function(cell) {
		if (cell.owner != 0) {
			if (ownerRecord[cell.owner]) {
				ownerRecord[cell.owner].push(cell);
			} else {
				ownerRecord[cell.owner] = [];
				ownerRecord[cell.owner].push(cell);
			}
		}
	});

	$('#mutation-points').empty()
	for (var i in mutationPoints) {
		mutationPoints[i]++;
		$('#mutation-points').append(i + ': ' + mutationPoints[i] + '; ');
	}

	// Update hit graph every 10 frames
	if (turnCounter % 10 == 0) {
		layer.draw();
	} else {
		layer.drawScene();
	}
	setTimeout(turn, 10);
}

turn();