function Brood(game, color) {
	this.game = game;
	this.color = color;
	this.cells = [];

	this.ownCell = function(cell) {
		// Add to our cells
		this.cells.push(cell);
	};
	// Cells must have their broods set properly again after this
	this.disownCell = function(cell) {
		console.log('length preremoval:', this.cells.length);
		_.pull(this.cells, cell);
		console.log('length postremoval:', this.cells.length);
	};
	Brood.allBroods.push(this);

	console.log('Brood created with ' + this.color + '!');
}
Brood.allBroods = [];
Brood.existingColors = {};