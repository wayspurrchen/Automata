var GRID_WIDTH  = 60;
var GRID_HEIGHT = 60;
var GRID_CELL_SIZE = 5;

var stage = new Kinetic.Stage({
	container: 'container',
	width: GRID_WIDTH * GRID_CELL_SIZE,
	height: GRID_HEIGHT * GRID_CELL_SIZE
});

var layer = new Kinetic.Layer();
stage.add(layer);

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

function CellView(x, y, fill) {
	this.rect = new Kinetic.Rect({
		width: GRID_CELL_SIZE,
		height: GRID_CELL_SIZE,
		x: x * GRID_CELL_SIZE,
		y: y * GRID_CELL_SIZE,
		fill: fill,
		opacity: 0.7
	});
	layer.add(this.rect);
}
CellView.prototype.move = function(x, y) {	
	this.rect.setAttr('x', x * GRID_CELL_SIZE);
	this.rect.setAttr('y', y * GRID_CELL_SIZE);
};
CellView.prototype.setOwner = function(color) {
	this.rect.setAttr('fill', color)
};

function Cell(x, y, owner) {
	this.view = new CellView(x, y, owners[owner]);
	this.x = x;
	this.y = y;
	this.owner = owner;
	cells[x][y] = this;
}
Cell.prototype.movedCells = [];
Cell.prototype.move = function(cell) {
	cell.setOwner(this.owner);
	this.setOwner(0);
};
Cell.prototype.setOwner = function(owner) {
	this.movedThisTurn = true;
	this.movedCells.push(this);
	this.owner = owner;
	this.view.setOwner(owners[owner]);
};
Cell.prototype.getSurroundingCells = function() {
	var surroundingCells = {
		cells: {},
		owners: {}
	};
	if (this.x + 1 < GRID_WIDTH) {
		surroundingCells.cells.right = cells[this.x + 1][this.y];
	}
	if (this.x - 1 >= 0) {
		surroundingCells.cells.left = cells[this.x - 1][this.y];
	}
	if (this.y + 1 < GRID_HEIGHT) {
		surroundingCells.cells.bottom = cells[this.x][this.y + 1];
	}
	if (this.y - 1 >= 0) {
		surroundingCells.cells.top = cells[this.x][this.y - 1];
	}

	// Accumulate count of cell owners in owners property
	for (var i in surroundingCells.cells) {
		if (surroundingCells.cells[i].owner == 0 ||
			surroundingCells.cells[i].owner == this.owner) continue;
		if (surroundingCells.owners[surroundingCells.cells[i].owner]) {
			surroundingCells.owners[surroundingCells.cells[i].owner]++;
		} else {
			surroundingCells.owners[surroundingCells.cells[i].owner] = 1;
		}
	}
	return surroundingCells;
};
Cell.prototype.takeTurn = function() {
	if (this.owner == 0) return;
	if (this.movedThisTurn) {
		this.movedThisTurn = false;
		return;
	}

	var surroundingCells = this.getSurroundingCells();

	var conquered = this.checkConquered(surroundingCells);
	if (conquered.result) {
		this.setOwner(conquered.conqueror);
		return;
	}

	var fight = this.checkFight(surroundingCells);
	if (fight.result) {
		if (fight.winner == this) {
			fight.loser.setOwner(this.owner);
			fight.loser.movedThisTurn = true;
		} else {
			this.setOwner(fight.winner.owner);
			fight.winner.movedThisTurn = true;
		}
		return;
	}

	var randomUnoccupied = this.getRandomUnoccupiedNeighbor();
	if (randomUnoccupied) {
		// Coin toss to move or reproduce into empty space
		if (randomInt(2) == 0) {
			this.divide(randomUnoccupied);
		} else {
			this.move(randomUnoccupied);
		}
	}
};
Cell.prototype.getRandomUnoccupiedNeighbor = function() {
	var surroundingCells = this.getSurroundingCells();

	var unoccupiedCells = [];
	for (var i in surroundingCells.cells) {
		if (surroundingCells.cells[i].owner == 0) {
			unoccupiedCells.push(surroundingCells.cells[i]);
		}
	}
	if (unoccupiedCells.length > 0) {
		return unoccupiedCells[randomInt(unoccupiedCells.length)];
	}
};
// Divide into a given cell
Cell.prototype.divide = function(cell) {
	cell.setOwner(this.owner);
};
// Check whether or not this cell gets eaten by surrounding cells
Cell.prototype.checkConquered = function(surroundingCells) {
	var conquered = {
		result: false
	};

	for (var i in surroundingCells.owners) {
		if (surroundingCells.owners[i] >= 3) {
			conquered.result = true;
			conquered.conqueror = i;
		}
	}
	return conquered;
};
Cell.prototype.checkFight = function(surroundingCells) {
	var fight = {
		result: false
	};

	// Get all the viable opponents for a fight
	var opponentIds = [];
	for (var j in surroundingCells.owners) {
		var opponentCount = surroundingCells.owners[j];
		if (opponentCount >= 1) {
			opponentIds.push(j);
		}
	}
	if (opponentIds.length == 0) return fight;

	// Pick a random adjacent opponent
	var opponentsCountLength = opponentIds.length;
	if (opponentsCountLength > 0) {
		for (var k = 0; k < opponentsCountLength; k++) {
			// We can safely set the result to be true--we wouldn't
			// get here if there weren't a surrounding cell of the owner
			fight.result = true;
			// Pick a random opponent
			var opponentId = opponentIds[randomInt(opponentsCountLength)];
		}
	}

	// Grab random cell from the chosen owner
	var opponentCells = [];
	for (var i in surroundingCells.cells) {
		if (surroundingCells.cells[i].owner == opponentId) {
			opponentCells.push(surroundingCells.cells[i]);
		}
	}
	var opponentCell = opponentCells[randomInt(opponentCells.length)];

	var thisCellWins = randomInt(2) == 0;
	if (thisCellWins) {
		fight.winner = this;
		fight.loser  = opponentCell;
	} else {
		fight.winner = opponentCell;
		fight.loser  = this;
	}
	return fight;
};

function setup() {
	makeCells();
}

function makeCells() {
	for (var i = 0; i < GRID_WIDTH; i++) {
		cells[i] = [];
		for (var j = 0; j < GRID_HEIGHT; j++) {
			cells[i][j] = new Cell(i, j, 0);
		}
	}
	cells[0][0].setOwner(1);
	cells[0][GRID_HEIGHT - 1].setOwner(2);
	cells[GRID_WIDTH - 1][GRID_HEIGHT - 1].setOwner(3);
	cells[GRID_WIDTH - 1][0].setOwner(4);
	// cells[GRID_WIDTH / 2 - 1][GRID_HEIGHT / 2 - 1].setOwner(5);
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