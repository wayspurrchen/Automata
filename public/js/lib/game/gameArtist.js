// In charge of rendering the canvas.
function GameArtist(game) {
	this.game = game;
	// Create and append canvas
	this.canvas = this.game.$view.find('#automata-canvas')[0];
	this.canvas.width  =
		this.game.Constants.GRID_WIDTH * this.game.Constants.GRID_CELL_SIZE;
	this.canvas.height =
		this.game.Constants.GRID_HEIGHT * this.game.Constants.GRID_CELL_SIZE;
	
	// Create secondary, off-screen buffer
	this.canvasBuffer = $('<canvas>')[0];
	this.canvasBuffer.width  = this.canvas.width;
	this.canvasBuffer.height = this.canvas.height;
	this.bufferContext = this.canvas.getContext('2d');
	this.context = this.canvas.getContext('2d');
	this.clearCanvas = function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};
	this.draw = function() {
		// Grab all cells
		var cells = this.game.cellController.getAllCells();
		// Force them to draw to our bufferContext
		_.each(cells, function(cell) {
			cell.draw();
		});

		// Draw out from the buffer
		this.context.drawImage(this.canvasBuffer, 0, 0);
	};

}