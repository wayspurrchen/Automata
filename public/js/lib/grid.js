function Grid(game, width, height, containerSelector) {
	this.game = game;

	this.spaces = [];
	this.width  = width;
	this.height = height;

	// A space in the grid
	function Space(grid, x, y) {
		this.grid = grid;
		this.x = x;
		this.y = y;
		this.cell = null;
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
	// and in the darkness, bind them
	Space.prototype.setCell = function(cell) {
		this.cell = cell;
	};

	this.getSpace = function(x, y) {
		if (this.spaces[x]) {
			if (this.spaces[y]) {
				return this.spaces[x][y]
			}
		}
		// implicit return of undefined if we can't find anything 
	};
	// Return a flattened array of all spaces (for drawing usually)
	this.getSpacesFlat = function() {
		var flat = [];
		// Generate spaces
		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {
				flat.push(this.spaces[i][j]);
			}
		}
		return flat;
	};

	// Generate spaces
	for (var i = 0; i < width; i++) {
		this.spaces[i] = [];
		for (var j = 0; j < height; j++) {
			this.spaces[i][j] = new Space(this, i, j);
		}
	}
}
