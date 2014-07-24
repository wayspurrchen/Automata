function Grid(width, height) {
	var spaces  = [];
	this.width  = width;
	this.height = height;

	// Generate spaces
	for (var i = 0; i < width; i++) {
		spaces[i] = [];
		for (var j = 0; j < height; j++) {
			spaces[i][j] = new Space(i, j);
		}
	}

	this.getSpace = function(x, y) {
		return spaces[y][x];
	};
}

function Space(x, y) {
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
	this.cells.push(cell);
};
Space.prototype.disassociateCell = function(cell) {
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

var grid = new Grid(GRID_WIDTH, GRID_HEIGHT);