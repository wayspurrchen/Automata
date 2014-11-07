// Cell objects are ignorant of their x and y position--
// they merely access surrounding spaces, which can also
// have entities.
function Cell(game, brood, space, moved) {
	this.brood = brood;
	this.game  = game;
	this.space = space;
	// Indicates that this cell has not already moved,
	// divided, conquered, etc. this turn
	this.moved = moved || false;
	this.view = new CellView(game, this);
}
Cell.prototype.draw = function() {
	this.view.draw();
};
Cell.prototype.show = function() {
	this.view.show();
};
Cell.prototype.hide = function() {
	this.view.hide();	
};
// Set space
Cell.prototype.setSpace = function(space) {
	this.space = space;
};
// Set parent brood. TODO: unset from other brood parents!!
Cell.prototype.setBrood = function(brood) {
	this.brood = brood;
	this.view.setColor(this.brood.color);
};
// Returns the cells surrounding this cell,
// as well as a count of the number of broods
// in the area
Cell.prototype.getSurroundingCells = function() {
	var surroundingCells = {
		cells: {},
		broods: {}
	};
	var rightSpace = this.space.getRightSpace();
	var leftSpace = this.space.getLeftSpace();
	var bottomSpace = this.space.getBottomSpace();
	var topSpace = this.space.getTopSpace();

	if (rightSpace) {
		surroundingCells.cells.right = rightSpace.cell;
	}
	if (leftSpace) {
		surroundingCells.cells.left = leftSpace.cell;
	}
	if (bottomSpace) {
		surroundingCells.cells.bottom = bottomSpace.ell;
	}
	if (topSpace) {
		surroundingCells.cells.top = topSpace.cell;
	}

	// Accumulate count of cell broods in broods property
	for (var i in surroundingCells.cells) {
		// Don't count own broods in owners
		if (surroundingCells.cells[i].brood ==  his.brood) continue;
		if (surroundingCells.broods[surroundingCells.cells[i].brood]) {
			surroundingCells.broods[surroundingCells.cells[i].brood]++;
		} else {
			surroundingCells.broods[surroundingCells.cells[i].brood] = 1;
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
// Gets a random, unoccupied neighbor space
Cell.prototype.getRandomUnoccupiedNeighbor = function() {
	var surroundingSpaces = this.space.getNeighborhood();

	var unoccupiedSpaces = [];
	for (var i in surroundingSpaces) {
		if (!surroundingSpaces.cell) {
			unoccupiedCells.push(surroundingCells[i]);
		}
	}
	if (unoccupiedCells.length > 0) {
		return unoccupiedCells[randomInt(unoccupiedCells.length)];
	}
	// implicit undefined return
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