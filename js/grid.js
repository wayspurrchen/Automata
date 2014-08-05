function Grid(game, width, height, containerSelector) {
	this.game = game;

	this.spaces = [];
	this.width  = width;
	this.height = height;

	// Removes cells from the grid entirely
	this.addCell = function(x, y, cell) {
		var space = this.getSpace(x, y);
		space.associateCell(cell);
	};
	this.detachCell = function(x, y, cell) {
		var space = this.getSpace(x, y);
		space.disassociateCell(cell);
	};

	function Space(grid, x, y) {
		this.grid = grid;
		this.x = x;
		this.y = y;
		this.cells = [];
	}
	Space.prototype.getTopSpace = function() {
		return this.grid.getSpace(this.x, this.y - 1);
	};
	Space.prototype.getBottomSpace = function() {
		return this.grid.getSpace(this.x, this.y + 1);
	};
	Space.prototype.getLeftSpace = function() {
		return this.grid.getSpace(this.x - 1, this.y);
	};
	Space.prototype.getRightSpace = function() {
		return this.grid.getSpace(this.x + 1, this.y);
	};
	Space.prototype.getTopLeftSpace = function() {
		return this.grid.getSpace(this.x - 1, this.y - 1);
	};
	Space.prototype.getTopRightSpace = function() {
		return this.grid.getSpace(this.x + 1, this.y - 1);
	};
	Space.prototype.getBottomLeftSpace = function() {
		return this.grid.getSpace(this.x - 1, this.y + 1);
	};
	Space.prototype.getBottomRightSpace = function() {
		return this.grid.getSpace(this.x + 1, this.y + 1);
	};
	Space.prototype.getNeighborhood = function() {
		return {
			center: this,
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
		if (this.cells.length < this.grid.game.Constants.GRID_CLUSTER_SIZE) {
			cell.currentSpace = this;
			this.cells.push(cell);
		} else {
			throw new Error('shouldn\'t be trying to do this!!');
		}
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
		if (this.cells.length < this.game.Constants.GRID_CLUSTER_SIZE) {
			return true;
		} else {
			return false;
		}
	};

	this.getSpace = function(x, y) {
		if (this.spaces[x]) {
			if (this.spaces[y]) {
				return this.spaces[x][y]
			}
		}
		// implicit return of undefined if we can't find anything 
	};

	// Generate spaces
	for (var i = 0; i < width; i++) {
		this.spaces[i] = [];
		for (var j = 0; j < height; j++) {
			this.spaces[i][j] = new Space(this, i, j);
		}
	}
}
