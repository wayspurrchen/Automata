function AutomataGame(containerSelector) {
	var primaryTemplate = _.template($('#automata-template').html());

	this.broods = [];
	this.cellController = new CellController(this);
	this.controller = new GameController(this);
	// this template stuff needs to go in gameUI.js
	this.$view = $(primaryTemplate());
	this.Constants = new AutomataConstants();
	this.$container = $(containerSelector);
	this.$container.append(this.$view);
	// Set this up to render our page
	this.artist = new GameArtist(this);
	this.ui = new GameUILayer(this);

	this.speed = 100;

	this.grid = new Grid(
		this,
		this.Constants.GRID_WIDTH,
		this.Constants.GRID_HEIGHT,
		containerSelector
	);

	this.generation = 0;

	// TODO: color picking stuff
	this.start = function() {
		console.log('STARTING');
		var rbrood = this.controller.addBrood('#ff0000');
		var gbrood = this.controller.addBrood('#00ff00');
		var bbrood = this.controller.addBrood('#0000ff');
		var blbrood = this.controller.addBrood('#000000');
		for (var i = 0; i < this.Constants.GRID_WIDTH / 2; i++) {
			for (var j = 0; j < this.Constants.GRID_HEIGHT / 2; j++) {
				var space = this.grid.getSpace(i, j);
				this.cellController.createCell(rbrood, space, false);
			}
		}
		for (var i = 0; i < this.Constants.GRID_WIDTH / 2; i++) {
			for (var j = 0; j < this.Constants.GRID_HEIGHT / 2; j++) {
				space = this.grid.getSpace(
					i + (this.Constants.GRID_WIDTH / 2),
					j + (this.Constants.GRID_HEIGHT / 2)
				);
				this.cellController.createCell(gbrood, space, false);
			}
		}
		for (var i = 0; i < this.Constants.GRID_WIDTH / 2; i++) {
			for (var j = 0; j < this.Constants.GRID_HEIGHT / 2; j++) {
				space = this.grid.getSpace(
					i,
					j + (this.Constants.GRID_HEIGHT / 2)
				);
				this.cellController.createCell(blbrood, space, false);
			}
		}
		for (var i = 0; i < this.Constants.GRID_WIDTH / 2; i++) {
			for (var j = 0; j < this.Constants.GRID_HEIGHT / 2; j++) {
				space = this.grid.getSpace(
					i + (this.Constants.GRID_WIDTH / 2),
					j
				);
				this.cellController.createCell(bbrood, space, false);
			}
		}
		// var topLeftSpace = this.grid.getSpace(0, 0);
		// var topRightSpace = this.grid.getSpace(
		// 	this.Constants.GRID_WIDTH - 1,
		// 	0
		// );
		// var bottomRightSpace = this.grid.getSpace(
		// 	this.Constants.GRID_WIDTH - 1,
		// 	this.Constants.GRID_HEIGHT - 1
		// );
		// var bottomLeftSpace = this.grid.getSpace(
		// 	0,
		// 	this.Constants.GRID_HEIGHT - 1
		// );
		// this.cellController.createCell(bbrood, topLeftSpace, false);
		// this.cellController.createCell(gbrood, topRightSpace, false);
		// this.cellController.createCell(blbrood, bottomRightSpace, false);
		// this.cellController.createCell(rbrood, bottomLeftSpace, false);

		this.controller.play();
	};
}