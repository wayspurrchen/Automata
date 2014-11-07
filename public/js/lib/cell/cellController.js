// High-level cell controller in charge of manipulating,
// moving, creating, destroying/etc. cells.
function CellController(game) {
	this.game = game;
	// Get all cells currently at play in the game
	this.getAllCells = function() {
		var allCells = [];
		for (var i = 0; i < this.game.broods.length; i++) {
			allCells = allCells.concat(this.game.broods[i].cells);
		}
		return allCells;
	}
	// Returns an object containing the broods as keys
	// and the number of cells they have as colors
	this.getCellDistribution = function() {
		var cellDistribution = {};
		for (var i = 0; i < this.game.broods; i++) {
			cellDistribution[this.game.broods[i].color] = this.game.broods[i];
		}
		return cellDistribution;
	};
	// Execute a turn, iterating through each individual cell.
	this.turn = function() {
		// Reset turns on cells anew
		var allCells = this.getAllCells();
		for (var i = 0; i < allCells; i++) {
			allCells[i].moved = false;
		}
		// Shuffle up cells so we don't run into bottom-right power
		// due to iteration order
		var randomCells = _.shuffle(allCells);
		// Iterate through array backwards so we can pop stuff off,
		// better performance than shift
		for (var i = randomCells.length; i > 0; i--) {
			var cell = randomCells[i].pop();
			// Take a turn - if the cell hasn't moved
			if (!cell.moved) this.cellTurn(cell);
		}
	};
	// Take a turn for the cell. Check if we've been conquered, if we
	// (have to) win a fight, divide or move into a random unoccupied Space.
	this.cellTurn = function(cell) {
		// Get this cell's surroundings
		var surroundings = cell.getSurroundingCells();

		// Check for conquer scenario
		var conquered = this.cellConquered(randomCells, surroundings);
		if (conquered.result) {
			cell.setBrood(conquered.conqueror);
			cell.moved = true;
			return;
		}

		// Act on fight scenario
		var fight = this.cellFight(surroundings);
		if (fight.result) {
			if (fight.winner == cell.brood) {
				fight.loser.setBrood(cell.brood);
				fight.loser.moved = true;
			} else {
				cell.setOwner(fight.winner.brood);
				fight.winner.moved = true;
			}
			return;
		}

		// Move or divide
		var randomUnoccupied = cell.getRandomUnoccupiedNeighbor();
		if (randomUnoccupied) {
			// Coin toss to move or reproduce into empty space
			if (randomInt(2) == 0) {
				// Create a cell with our brood in the random
				// unoccupied space and also specify that its
				// move is up
				this.createCell(cell.brood, randomUnoccupied, true);
			} else {
				this.moveCell(randomUnoccupied);
			}
		}
	};
	// Checks whether or not a cell is conquered by its neighbours
	// by getting the surrounding cells and accumulating the count
	// of enemy broods. If it's 3 or more, this cell has been defeated.
	this.cellConquered = function(cell, surroundings) {
		var conquered = {
			result: false
		};
		for (var i in surroundings.broods) {
			if (surroundings.broods[i] >= 3) {
				conquered.result = true;
				conquered.conqueror = i;
			}
		}
		return conquered;
	};
	this.cellFight = function(surroundings) {
		var fight = {
			result: false
		};

		// Get all the viable opponents for a fight
		var opponentIds = [];
		for (var j in surroundings.broods) {
			var opponentCount = surroundings.broods[j];
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
		for (var i in surroundings.cells) {
			if (surroundings.cells[i].owner == opponentId) {
				opponentCells.push(surroundings.cells[i]);
			}
		}
		var opponentCell = opponentCells[randomInt(opponentCells.length)];

		// Coin flip to win
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
	this.moveCell = function(cell, space) {
		// Detach from current space
		cell.space.setCell(null);
		// and in the darkness, bind them
		space.setCell(cell);
		cell.setSpace(space);
		cell.moved = true;
	};
	// Tell a Brood to create a cell
	this.createCell = function(brood, space, moved) {
		var cell = new Cell(
			this.game,
			brood,
			space,
			moved
		);
		brood.ownCell(cell);
		space.setCell(cell);
	};
}