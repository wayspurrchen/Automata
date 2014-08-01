// KineticJS stage
function Grid(game, width, height, containerSelector) {
	this.game = game;

	this.spaces = [];
	this.width  = width;
	this.height = height;

	this.kineticStage = new Kinetic.Stage({
		container: containerSelector,
		width: width * game.Constants.GRID_CELL_SIZE,
		height: height * game.Constants.GRID_CELL_SIZE
	});

	this.kineticLayer = new Kinetic.Layer();
	this.kineticStage.add(this.kineticLayer);

	// Removes cells from the grid entirely
	this.addCell = function(x, y, cell) {
		var space = this.getSpace(x, y);
		space.associateCell(cell);
		this.kineticLayer.add(cell.view.rect);
	};
	this.detachCell = function(x, y, cell) {
		var space = this.getSpace(x, y);
		space.disassociateCell(cell);
		cell.view.rect.remove();
	};

	function Space(grid, x, y) {
		this.grid = grid;
		this.x = x;
		this.y = y;
		this.cells = [];
	}
	Space.prototype.getTopSpace = function() {
		return Grid.getSpace(this.x, this.y - 1);
	};
	Space.prototype.getBottomSpace = function() {
		return Grid.getSpace(this.x, this.y + 1);
	};
	Space.prototype.getLeftSpace = function() {
		return Grid.getSpace(this.x - 1, this.y);
	};
	Space.prototype.getRightSpace = function() {
		return Grid.getSpace(this.x + 1, this.y);
	};
	Space.prototype.getTopLeftSpace = function() {
		return Grid.getSpace(this.x - 1, this.y - 1);
	};
	Space.prototype.getTopRightSpace = function() {
		return Grid.getSpace(this.x + 1, this.y - 1);
	};
	Space.prototype.getBottomLeftSpace = function() {
		return Grid.getSpace(this.x - 1, this.y + 1);
	};
	Space.prototype.getBottomRightSpace = function() {
		return Grid.getSpace(this.x + 1, this.y + 1);
	};
	Space.prototype.getNeighborhoodSpaces = function() {
		return {
			top: this.getTopSpace(),
			right: this.getRightSpace(),
			bottom: this.getBottomSpace(),
			left: this.getLeftSpace(),
			topLeft: this.getTopLeftSpace(),
			topRight: this.getTopRightSpace(),
			bottomRight: this.getBottomRightSpace(),
			bottomLeft: this.getBottomLeftSpace()
		};
	};
	Space.prototype.associateCell = function(cell) {
		cell.currentSpace = this;
		this.cells.push(cell);
	};
	Space.prototype.disassociateCell = function(cell) {
		cell.currentSpace = null;
		for (var i in this.cells) {
			if (cell === this.cells[i]) {
				this.cells.splice(i, 1);
			}
		}
	};
	Space.prototype.cellCount = function() {
		return this.cells.length;
	};
	Space.prototype.getCells = function() {
		return this.cells;
	};
	Space.prototype.hasSpace = function() {
		if (this.cells.length < GRID_CLUSTER_SPACE) {
			return true;
		} else {
			return false;
		}
	};

	this.getSpace = function(x, y) {
		return this.spaces[y][x];
	};

	// Generate spaces
	for (var i = 0; i < width; i++) {
		this.spaces[i] = [];
		for (var j = 0; j < height; j++) {
			this.spaces[i][j] = new Space(this, i, j);
		}
	}
}
