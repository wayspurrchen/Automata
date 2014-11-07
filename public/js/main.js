var GRID_WIDTH  = 60;
var GRID_HEIGHT = 60;
var GRID_CELL_SIZE = 5;

var stage = new Kinetic.Stage({
	container: 'container',
	width: GRID_WIDTH * GRID_CELL_SIZE,
	height: GRID_HEIGHT * GRID_CELL_SIZE
});

var layer = new Kinetic.Layer();
var generation = 0;
stage.add(layer);

var cells = [];
var owners = {
	0: '#ffffff',
	1: '#ff0000',
	2: '#0000ff',
	3: '#800080',
	4: '#ffa500',
	5: '#008000',
	6: '#40e0d0',
	7: '#000000'
};


function randomInt(max, min) {
	if (typeof min === 'undefined') min = 0;
	return Math.floor(Math.random() * (max - min)) + min;
}


function setup() {
	var $owners = $('#owners');
	for (var i in owners) {
		var $picker = $('<span class="owner-picker">');
		$owners.append($picker);
		$picker.css('background-color', owners[i]);
		var color = owners[i].substring(1);
		$picker.colpick({
			color: color
		});
	}
	makeCells();
}

function makeCells() {
	for (var i = 0; i < GRID_WIDTH; i++) {
		cells[i] = [];
		for (var j = 0; j < GRID_HEIGHT; j++) {
			cells[i][j] = new Cell(i, j, 0);
		}
	}
	cells[0][0].setOwner(1);
	cells[0][GRID_HEIGHT - 1].setOwner(2);
	cells[GRID_WIDTH - 1][GRID_HEIGHT - 1].setOwner(3);
	cells[GRID_WIDTH - 1][0].setOwner(4);
}

setup();

function iterateCells(callback) {
	for (var i = 0; i < GRID_WIDTH; i++) {
		for (var j = 0; j < GRID_HEIGHT; j++) {
			callback(cells[i][j]);
		}
	}
}

function iterateRandomCells(callback) {
	var randomCells = [];
	iterateCells(function(cell) {
		randomCells.push(cell);
	});
	randomCells = _.shuffle(randomCells);
	var length = randomCells.length;
	for (var i = 0; i < length; i++) {
		callback(randomCells[i]);
	}
}

var turnCounter = 0;

function turn() {
	turnCounter++;
	// console.log('Taking turn!');
	var ownerRecord = {};

	iterateRandomCells(function(cell) {
		cell.takeTurn();
	});

	// Clear moved status from movedCells--we have to do this because
	// new cells created to the left of the cell's turn being executed
	// will be incorrectly moved on the next set of turns
	var movedLength = Cell.prototype.movedCells.length;
	for (var i = 0; i < movedLength && movedLength > 0; i++) {
		var movedCell = Cell.prototype.movedCells.pop();
		movedCell.movedThisTurn = false;
	}

	// Check ownerships after completion
	iterateCells(function(cell) {
		if (cell.owner != 0) {
			if (ownerRecord[cell.owner]) {
				ownerRecord[cell.owner].push(cell);
			} else {
				ownerRecord[cell.owner] = [];
				ownerRecord[cell.owner].push(cell);
			}
		}
	});

	generation++;
	$('#mutation-points').empty().append('Generations: ', generation);

	var turnSpeed = 150;
	// Update hit graph every n frames
	if (turnCounter % turnSpeed == 0) {
		layer.draw();
	} else {
		layer.drawScene();
	}
	setTimeout(turn, turnSpeed);
}

turn();