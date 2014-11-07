function GameController(game) {
	this.game = game;
	// Add a brood to the game
	this.addBrood = function(color) {
		var brood = new Brood(this.game, color);
		return brood;
	};
	// Remove a brood from play
	this.removeBrood = function(color) {
		this.game.broods = _.remove(this.game.broods, function(brood) {
			return brood.color != color;
		});
	};
	// Get a brood by color
	this.getBrood = function(color) {
		return _.find(this.game.broods, function(brood) {
			return brood.color == color;
		});
	};
	// Store a reference to our timeout so we can cancel it later
	// if the user pauses (important because otherwise we might
	// accidentally create two or more event threads)
	this.turnTimeout = undefined;
	// Executes a turn, kicking off rendering and logical modifications
	this.turn = function() {
		// Clear the canvas
		this.game.artist.clearCanvas();

		// Make our cells execute their logic
		this.game.cellController.turn();

		// Remove any broods that don't exist anymore
		var distributions = this.game.cellController.getCellDistribution();
		for (var i = 0; i < distributions.length; i++) {
			if (distributions[i].count == 0) {
				this.game.controller.removeBrood(distributions[i].brood);
			}
		}

		// Redraw our game
		this.game.artist.draw();
		this.game.ui.renderBroodSquares(distributions);

		// Increment generation
		this.game.generation++;

		// If we haven't paused the game in the interim, 
		if (this.game.playing) {
			// Set up the next turn
			this.turnTimeout = setTimeout(this.turn.bind(this), this.game.speed);
		}
	};
	this.play = function() {
		if (!this.game.playing) {
			clearTimeout(this.turnTimeout);
			this.game.playing = true;
			// Kick off
			this.turn();
		}
	};
	this.pause = function() {
		if (this.game.playing) {
			clearTimeout(this.turnTimeout);
			this.game.playing = false;
		}
	};
	this.setSpeed = function(speed) {
		this.game.speed = speed;
	};

	this.setSelectedColor = function(color) {
		this.game.selectedColor = color;
	};
}
