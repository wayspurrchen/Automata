function Brood(game, color) {
	this.game = game;
	this.color = color;
	this.cells = [];

	this.ownCell = function(cell) {
		// Set brood properly on cell
		cell.setBrood(this);
		// Add to our cells
		this.cells.push(cell);
	};
	// very not-performant - optimize later.
	// possibly into transferOwnership property
	// on Brood constructor function?
	this.disownCell = function(cell) {
		// this.
	};

	console.log('Brood created with ' + this.color + '!');
}