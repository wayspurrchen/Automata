var cells = [];

// Holds queued cells for reuse after destruction. More efficient to hide cells
// and move them off-canvas.
// NOTE 2014-07-23: FURTHER OPTIMIZATION: have each cell that's actually on-the-grid
// draw itself. occasionally render hitgraphs
function CellCacheQueue() {
	var queue = [];
	// We want to cache as many cells as there are, times however many cells can be on
	// one cell at a time
	var cellCount = GRID_WIDTH * GRID_HEIGHT * GRID_CLUSTER_SIZE;

	this.enqueue = function(cell) {
		queue.push(cell);
	};
	this.dequeue = function(cell) {
		return queue.shift();
	};
	this.getCount = function() {
		return queue.length;
	};

	for (var i = 0; i < cellCount; i++) {
		// Create and enqueue a bunch of cached cels
		var cachedCell = new Cell(0, 0, 0, true);
		this.enqueue(cachedCell);
	}
}

function CellView(x, y, fill, cached) {
	this.rect = new Kinetic.Rect({
		width: GRID_CELL_SIZE,
		height: GRID_CELL_SIZE,
		x: x * GRID_CELL_SIZE,
		y: y * GRID_CELL_SIZE,
		fill: fill,
		opacity: 0.7
	});
	if (!cached) {
		layer.add(this.rect);
	}
}
CellView.prototype.move = function(x, y) {	
	this.rect.setAttr('x', x * GRID_CELL_SIZE);
	this.rect.setAttr('y', y * GRID_CELL_SIZE);
};
CellView.prototype.setOwner = function(color) {
	this.rect.setAttr('fill', color)
};

// If cached == true, don't add this cell to the layer
function Cell(x, y, owner, cached) {
	this.view = new CellView(x, y, owners[owner], cached);
	this.x = x;
	this.y = y;
	this.health = CELL_START_HEALTH;
	this.owner  = owner;
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