function Player(game) {
	this.game = game;
	this.mutationPoints = 0;

	// Choose a random, untaken color
	var colors = this.game.Constants.COLORS;
	var takenColors = this.game.takenColors;
	for (var i = 0; i < takenColors.length; i++) {
		for (var j = 0; j < colors.length; j++) {
			if (takenColors[i] == colors[j]) {
				colors.splice(j, 1);
			}
		}
	}
	var randomIndex = Math.floor(Math.random() * colors.length);
	var randomColor = colors[randomIndex];
	this.color = randomColor;
	this.cells = [];

	this.createCell = function(x, y) {
		var cell = new Cell(this.game, x, y);
		cell.activate(this);
		this.associateCell(cell);
	};
	this.associateCell = function(cell) {
		this.cells.push(cell);
	};
	this.disassociateCell = function(cell) {
		for (var i in this.cells) {
			if (cell === this.cells[i]) {
				this.cells.splice(i, 1);
			}
		}
	};

	console.log('Player created with ' + this.color + '!');
}