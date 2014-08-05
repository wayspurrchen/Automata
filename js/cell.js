// Holds queued cells for reuse after destruction. More efficient to hide cells
// and move them off-canvas.
// NOTE 2014-07-23: FURTHER OPTIMIZATION: have each cell that's actually on-the-grid
// draw itself. occasionally render hitgraphs
function CellCacheQueue(game) {
	this.game = game;

	var queue = [];
	// We want to cache as many cells as there are, times however many cells can be on
	// one cell at a time
	var cellCount =
		this.game.Constants.GRID_WIDTH *
		this.game.Constants.GRID_HEIGHT *
		this.game.Constants.GRID_CLUSTER_SIZE;

	this.enqueueCell = function(cell) {
		queue.push(cell);
	};
	this.dequeueBlankCell = function() {
		var cell = queue.shift();
		return cell;
	};
	this.getCount = function() {
		return queue.length;
	};
}

function CellView(game, cell, fill) {
	this.game = game;
	var ctx = this.game.bufferContext;

	this.opacity = 0.333;
	this.cell = cell;

	this.draw = function() {
		if (!this.visible) return;
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(
			this.cell.x,
			this.cell.y,
			this.cell.x * this.game.Constants.GRID_CELL_SIZE,
			this.cell.y * this.game.Constants.GRID_CELL_SIZE
		);
	};
	this.show = function() {
		this.visible = true;
		// this.rect.show();
	};
	this.hide = function() {
		this.visible = false;
		// this.rect.hide();
	};
}
CellView.prototype.setOwner = function(color) {
	var rgb = hexToRgb(color);
	this.fillStyle = "rgba(" + rgb["r"] + "," +rgb["g"] + "," + rgb["b"] + ",0.333)";
};

// Cells start inactive, must be activated
function Cell(game, x, y) {
	this.game   = game;
	this.x      = x;
	this.y      = y;
	this.view   = new CellView(game, this);
	this.active = false;
	this.draw = function() {
		this.view.draw();
	};
	this.show = function() {
		this.view.show();
	};
	this.hide = function() {
		this.view.hide();
	};
	// Enable cell's existence
	this.activate = function(owner, x, y, moved) {
		// Housekeeping
		this.health = this.game.Constants.CELL_START_HEALTH;
		this.active = true;
		this.owner  = owner;
		this.movedThisTurn = moved;
		this.show();
		// Set owner
		this.view.setOwner(owner.color);
		// Add to grid/associate with space
		this.x = x;
		this.y = y;
		this.game.grid.addCell(this.x, this.y, this);
		// Update inactive/active cell sets
		_.pull(Cell.inactiveCells, this);
		Cell.activeCells.push(this);
	};
	// Remove the cell from play and from the canvas
	this.deactivate = function() {
		// Disable owner
		this.owner.disassociateCell(this);
		this.owner  = null;
		this.active = false;
		this.hide();
		// Remove from grid/deassociate from space
		this.game.grid.detachCell(this);
		// Update inactive/active cell sets
		_.pull(Cell.activeCells, this);
		Cell.inactiveCells.push(this);
	};
}
Cell.activeCells = [];
Cell.inactiveCells = [];
Cell.iterateActive = function(callback) {
	for (var i = 0; i < Cell.activeCells.length; i++) {
		var cell = Cell.activeCells[i];
		callback(cell);
	}
};
Cell.iterateRandomActive = function(callback) {
	var randomCells = [];
	Cell.iterateActive(function(cell) {
		randomCells.push(cell);
	});
	randomCells = _.shuffle(randomCells);
	var length = randomCells.length;
	for (var i = 0; i < length; i++) {
		callback(randomCells[i]);
	}
};
Cell.prototype.move = function(space) {
	this.x = space.x;
	this.y = space.y;
	this.movedThisTurn = true;
	// this.view.move(this.x, this.y);
	this.currentSpace.disassociateCell(this);
	this.currentSpace = this.game.grid.getSpace(this.x, this.y);
	this.currentSpace.associateCell(this);
};
Cell.prototype.setOwner = function(owner) {
	this.movedThisTurn = true;
	this.owner = owner;
	this.view.setOwner(owners[owner]);
};
Cell.prototype.getCurrentSpace = function() {
	return this.currentSpace;
};
// Cell.prototype.getSurroundingCells = function() {
// 	var surroundingCells = {
// 		allCells: [],
// 		cells: {},
// 		owners: {}
// 	};
// 	var neighborhood = this.getNeighborhood();
// 	for (var i in neighborhood) {
// 		var neighbor = neighborhood[i];
// 		surroundingCells.cells[i] = neighbor;
// 		surroundingCells.allCells = surroundingCells.allCells.concat(neighbor);
// 	}
// 	return surroundingCells;
// };
Cell.prototype.getNeighborhood = function() {
	return this.getCurrentSpace().getNeighborhood();
};
Cell.prototype.takeTurn = function() {
	if (this.owner == 0) return;
	if (this.movedThisTurn) {
		this.movedThisTurn = false;
		return;
	}

	var neighborhood = this.getNeighborhood();

	// var fight = this.checkFight(neighborhood.center);
	// if (fight.result) {
	// 	if (fight.winner == this) {
	// 		fight.loser.setOwner(this.owner);
	// 		fight.loser.movedThisTurn = true;
	// 	} else {
	// 		this.setOwner(fight.winner.owner);
	// 		fight.winner.movedThisTurn = true;
	// 	}
	// 	return;
	// }

	var randNeighbor = this.getRandNeighborWithSpace();
	if (randNeighbor) {
		// Coin toss to move or reproduce into empty space
		if (randomInt(2) == 0) {
			this.divide(randNeighbor);
		} else {
			this.move(randNeighbor);
		}
	}

	this.movedThisTurn = true;
};
// Gets a random neighbor with space
Cell.prototype.getRandNeighborWithSpace = function() {
	var neighborhood = this.getNeighborhood();

	var spaces = [];
	for (var i in neighborhood) {
		// If the number of cells in the neighborhood space are less than
		// the maximum allowed
		if (!neighborhood[i]) continue;
		if (neighborhood[i].cells.length < this.game.Constants.GRID_CLUSTER_SIZE) {
			spaces.push(neighborhood[i]);
		}
	}
	if (spaces.length > 0) {
		return spaces[randomInt(spaces.length)];
	}
};
// Divide into a given cell
Cell.prototype.divide = function(space) {
	this.owner.createCell(space.x, space.y, true);
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