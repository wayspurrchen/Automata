function GameController(game) {
	this.game = game;
	// Add a brood to the game
	this.addBrood = function(color) {
		this.game.broods.push(new Brood(this, color));
	};
	// Remove a brood from play
	this.removeBrood = function(color) {
		this.game.broods = _.remove(this.game.broods, function(brood) {
			return brood.color == color;
		});
	}
	// Store a reference to our timeout so we can cancel it later
	// if the user pauses (important because otherwise we might
	// accidentally create two or more event threads)
	this.turnTimeout = undefined;
	// Executes a turn, kicking off rendering and logical modifications
	this.turn = function() {
		// Get our initial cell distribution - not sure what needed for yet
		// this.game.cellController.getCellDistribution();

		// Clear the canvas
		this.game.artist.clearCanvas();

		// Make our cells execute their logic
		this.game.cellController.turn();

		// Redraw our game
		this.game.artist.draw();

		// Increment generation
		this.game.generation++;

		// Get our new cell distribution
		var distrib = this.game.cellController.getCellDistribution();

		// If any broods have no more cells, remove them from play
		for (var i in distrib) {
			if (distrib[i] == 0) {
				this.removeBrood(i);
			}
		}

		// If we haven't paused the game in the interim, 
		if (this.game.playing) {
			// Set up the next turn
			this.turnTimeout = setTimeout(this.turn.bind(this), this.game.speed);
		}
		
		// TODO HERE: render input controls, color pickers, etc.
		// thru some binding object
	};
	this.play = function() {
		clearTimeout(this.turnTimeout);
		this.game.playing = true;
		// Kick off
		this.turn();
	};
	this.pause = function() {
		clearTimeout(this.turnTimeout);
		this.game.playing = false;
	};
	this.setSpeed = function(speed) {
		this.game.speed = speed;
	};
}
