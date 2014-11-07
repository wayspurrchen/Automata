function CellView(game, cell, fill) {
	this.game = game;
	var ctx = this.game.bufferContext;
	this.cell = cell;

	this.draw = function() {
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(
			this.cell.x,
			this.cell.y,
			this.cell.x * this.game.Constants.GRID_CELL_SIZE,
			this.cell.y * this.game.Constants.GRID_CELL_SIZE
		);
	};
}
CellView.prototype.setOwner = function(color) {
	var rgb = hexToRgb(color);
	this.fillStyle = "rgb(" + rgb["r"] + "," +rgb["g"] + "," + rgb["b"] + ")";
};