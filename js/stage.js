var stage = new Kinetic.Stage({
	container: 'container',
	width: GRID_WIDTH * GRID_CELL_SIZE,
	height: GRID_HEIGHT * GRID_CELL_SIZE
});

var layer = new Kinetic.Layer();
stage.add(layer);