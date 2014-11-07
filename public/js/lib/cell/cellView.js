function CellView(game, cell, fill) {
	this.game = game;
	var ctx = this.game.artist.bufferContext;
	this.cell = cell;

	this.draw = function() {
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(
			this.cell.space.x,
			this.cell.space.y,
			this.cell.space.x * this.game.Constants.GRID_CELL_SIZE,
			this.cell.space.y * this.game.Constants.GRID_CELL_SIZE
		);
	};
}
CellView.prototype.setOwner = function(color) {
	var rgb = hexToRgb(color);
	this.fillStyle = "rgb(" + rgb["r"] + "," +rgb["g"] + "," + rgb["b"] + ")";
};